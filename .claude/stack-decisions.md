# ValoVerlay — Decisiones de stack

Registro de las decisiones de arquitectura tomadas para el overlay de OBS con
estadísticas de Valorant + panel de customización, y el razonamiento detrás
de cada una. Producto planteado como SaaS multi-usuario en `valoverlay.com`.

## 1. Estilos: CSS Modules + SASS

**Decisión:** CSS Modules combinado con SASS para las tres apps del
monorepo (panel, overlay y cualquier componente compartido).

**Por qué:**
- Fue la primera decisión fijada por el usuario, previa al resto del
  proceso de grilling — punto de partida no negociado del stack.
- Encaja de forma nativa con Vite sin configuración adicional (ver punto
  10), lo que reforzó la elección de React + Vite como framework frontend
  en vez de alternativas con peor soporte nativo de CSS Modules.

## 2. Fuente de datos de Valorant

**Decisión:** MSW (Mock Service Worker) durante desarrollo/tests → API
oficial de Riot Games en producción, endpoint `val-match-v1`.

**Por qué:**
- Riot **no ofrece personal keys** para Valorant — hay que pasar por
  revisión y conseguir una production key + un **RSO (Riot Sign-On) Client**
  aprobado. No es un simple API key como en League of Legends.
- `val-match-v1` sí existe y da datos de partida de un jugador, pero
  requiere que ese jugador pase por un flujo **OAuth con opt-in explícito**
  (RSO). No se pueden mostrar datos de un jugador que no ha autorizado la
  app.
- Caso de uso permitido explícitamente por la política de Riot: "training
  tools that allow players to view their own match histories and aggregate
  stats" — encaja con el producto.
- **Riesgo abierto:** la aprobación del RSO Client por parte de Riot no está
  garantizada y puede tardar. Se recomienda solicitarla cuanto antes,
  en paralelo al desarrollo contra mocks.

**Fuentes consultadas:**
- https://www.riotgames.com/en/DevRel/valorant-api-launch
- https://developer.riotgames.com/docs/valorant
- https://github.com/RiotGames/developer-relations/issues/560

## 3. Alcance del producto: SaaS multi-usuario desde el día 1

**Decisión:** no es un overlay personal — cualquier usuario podrá entrar a
`valoverlay.com`, autenticarse con su cuenta Riot y generar su propio
overlay/panel.

**Implicaciones directas sobre el resto del stack:**
- Cada usuario debe pasar su propio flujo OAuth (RSO) y dar consentimiento
  de compartir sus datos — no basta con una única autorización del
  desarrollador.
- Se necesita backend con gestión de sesiones, base de datos de usuarios y
  tokens OAuth (con refresh), y separación clara entre "sesión de nuestra
  app" y "token de Riot" (el segundo nunca debe llegar al navegador del
  usuario).
- El overlay debe funcionar sin sesión de navegador interactiva (ver punto 5).
- Fija también el nombre del producto/dominio: `valoverlay.com`.

## 4. Autenticación de usuarios: Better Auth + RSO

**Decisión:** Better Auth, con su plugin **Generic OAuth** apuntando a RSO
como proveedor, usando el **adapter oficial de Drizzle**.

**Por qué:**
- Riot es el único proveedor de identidad — no hay password propio que
  gestionar.
- RSO es OAuth2 estándar; el plugin Generic OAuth de Better Auth está
  pensado exactamente para proveedores custom que no vienen integrados de
  serie.
- Better Auth gestiona el ciclo completo: cookies `httpOnly` + `secure`,
  tabla de sesiones en Postgres, y permite revocar sesiones al instante si
  hace falta (a diferencia de un JWT stateless, que solo expira).
- El adapter de Drizzle encaja directamente con el ORM ya elegido (ver
  punto 8), sin duplicar capas de acceso a datos.

**Fuentes consultadas:**
- https://better-auth.com/docs/adapters/drizzle
- https://github.com/better-auth/better-auth (docs/content/docs/adapters/drizzle.mdx)

## 5. Identificación del overlay dentro de OBS

**Decisión:** URL única con token secreto por usuario, tipo
`valoverlay.com/o/<token-largo-random>`, pegada como Browser Source en OBS.

**Por qué:**
- OBS Browser Source no soporta login interactivo (no hay forma de meter
  usuario/contraseña ni completar un flujo OAuth dentro de OBS).
- El login con RSO ocurre **una sola vez**, en el panel web (ahí sí hay
  sesión de navegador normal vía Better Auth).
- El panel genera esa URL de overlay, que codifica un token opaco
  vinculado en el backend a la configuración y credenciales del usuario.
- Es el mismo patrón que usan StreamElements, Streamlabs, etc.
- Alternativa descartada: pasar config/credenciales por query params en la
  URL — inseguro, expone datos sensibles en texto plano y en capturas de
  pantalla compartidas sin querer.

## 6. Comunicación panel ↔ overlay en tiempo real

**Decisión:** Socket.IO, self-hosted en el mismo backend Node, con una
"room" por token de usuario.

**Por qué:**
- Reconexión automática integrada — crítico porque el overlay puede estar
  corriendo desatendido dentro de OBS durante horas o días sin que nadie
  interactúe con él.
- Sistema de rooms nativo, perfecto para aislar los eventos de cada usuario
  sin construir a mano un `Map<token, Set<socket>>` con heartbeats propios.
- **Aclaración importante:** Socket.IO no es un servicio gestionado ni
  introduce vendor lock-in — es una librería open-source (MIT) que se
  instala como paquete npm (`socket.io` + `socket.io-client`) y corre
  100% en el VPS propio. El lock-in aparecería si se usara un servicio de
  terceros hosteado tipo Pusher o Ably, que no es el caso.
- Alternativa descartada: `ws` nativo — más ligero pero obliga a
  reimplementar reconexión con backoff y el concepto de rooms a mano, justo
  en el punto donde más falta hace la fiabilidad.

## 7. Infraestructura y hosting

**Decisión:** un único VPS con Docker Compose — contenedor Node (API +
Socket.IO), contenedor Postgres, y Nginx como reverse proxy sirviendo el
build estático del panel/overlay.

**Por qué:**
- El usuario quería evitar vendor lock-in y pensar en términos de VPS
  propio en lugar de plataformas serverless.
- Vercel/Netlify (serverless) no sostienen bien conexiones WebSocket
  persistentes — descartadas para este caso de uso.
- Un solo VPS con Docker Compose es portable: mover de proveedor es mover
  el `docker-compose.yml` y los volúmenes, sin reescribir nada.
- Coste predecible (~5-10€/mes en Hetzner/DigitalOcean/similar) y fácil de
  razonar para un solo desarrollador.

## 8. Base de datos y ORM

**Decisión:** Postgres estándar (self-hosted en el VPS, sin features
propietarias de ningún proveedor gestionado) + Drizzle ORM.

**Por qué:**
- La preocupación inicial del usuario era el vendor lock-in de servicios
  como Supabase o Neon. Se aclaró que **Postgres en sí no genera lock-in**
  si se usa SQL estándar — el lock-in viene de funcionalidades propietarias
  específicas de un proveedor (auth integrado de Supabase, driver
  HTTP-only de Neon, etc.), no del motor de base de datos.
- Usando un ORM/driver estándar, migrar entre VPS o hacia un Postgres
  gestionado en el futuro es un `pg_dump` / `pg_restore`.
- Drizzle: tipo SQL-first, tipado con TypeScript de punta a punta, sin
  "magia" oculta, migraciones simples de leer. Ya usado y valorado
  positivamente por el usuario en proyectos previos.
- Config de widgets del panel almacenada como **JSONB** (columna flexible)
  en vez de columnas rígidas — ver punto 11.

## 9. Backend: Express + Drizzle

**Decisión:** Express como framework HTTP, con Drizzle como ORM.

**Por qué:**
- Drizzle es agnóstico del framework HTTP — funciona igual de bien con
  Express que con Fastify.
- Express es el más conocido/documentado del ecosistema Node, curva de
  entrada más suave.
- Único matiz frente a Fastify: Express no trae WebSockets integrados vía
  plugin, pero al usar Socket.IO (que se monta directamente sobre el
  servidor HTTP) esa diferencia deja de ser relevante.
- Alternativa descartada: NestJS — demasiada ceremonia/estructura
  opinionada para un proyecto de un solo desarrollador en esta fase.

## 10. Frontend: React + Vite

**Decisión:** React + Vite para las tres apps del panel y del overlay.

**Por qué:**
- CSS Modules funciona nativo en Vite sin configuración extra — encaja
  directo con la decisión previa de CSS Modules + SASS (ver punto 1).
- Ecosistema más grande para encontrar librerías de drag & drop, formularios,
  etc. cuando el panel escale (ver punto 11).
- TypeScript en todo el monorepo (server, panel, overlay, paquete
  compartido) — crítico porque el contrato de eventos Socket.IO y los
  payloads de stats se comparten entre las tres apps; un cambio de forma en
  un evento se detecta en compilación en vez de reventar el overlay en
  producción silenciosamente.

## 11. UX del panel de customización

**Decisión:** formulario simple para empezar — checkboxes para
activar/desactivar cada stat + select de posición preset
(`top-left`, `top-right`, etc.), con la puerta abierta a escalar a
drag & drop libre (dnd-kit) más adelante.

**Por qué:**
- Mucho más rápido de construir y de usar en una primera versión.
- Para que la migración a dnd-kit no sea destructiva para usuarios ya
  configurados: la config de cada widget se guarda como **JSONB** con un
  campo `position` de tipo preset. Cuando se añada dnd-kit, se incorporan
  campos opcionales `x` / `y` / `width` / `height` que, si están presentes,
  sobreescriben el preset — los overlays ya configurados siguen funcionando
  sin migración de datos.

## 12. Estructura del repositorio

**Decisión:** monorepo con **pnpm workspaces**.

```
apps/
  server/    # Express + Socket.IO + Drizzle + Better Auth
  panel/     # React + Vite — app de customización (con sesión de usuario)
  overlay/   # React + Vite — app que corre dentro del Browser Source de OBS
packages/
  shared/    # Tipos TS compartidos: eventos Socket.IO, schema Drizzle, payloads de stats
```

**Por qué:**
- Un solo repo versionado junto, sin duplicar tipos compartidos entre las
  tres apps.
- pnpm sobre npm workspaces: instalación más rápida, disco compartido
  entre paquetes vía symlinks, y filtrado cómodo por paquete
  (`pnpm --filter overlay dev`) — estándar de facto actual para monorepos
  JS/TS.
- Todo se levanta junto con un único `docker-compose.yml` (ver punto 7).

## Pendientes / riesgos abiertos

- **Aprobación del RSO Client por Riot** — bloqueante para tener datos
  reales en producción. Sin fecha garantizada; solicitar cuanto antes.
- Definir el esquema exacto de eventos Socket.IO (payloads de stats en
  vivo) antes de implementar `packages/shared`.
- Sin decidir todavía: pipeline de CI/CD, gestión de secretos en el VPS,
  y el detalle fino del flujo de refresh de tokens de Riot (expiración,
  reintentos).

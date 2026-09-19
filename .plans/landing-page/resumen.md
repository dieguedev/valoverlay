# Resumen ejecutivo — landing-page

## Qué se construye

El primer bloque del roadmap de ValoVerlay: la landing pública de
`valoverlay.com`, servida como rutas públicas sin sesión dentro de
`apps/panel` (misma app que alojará más adelante el dashboard de
customización, sin separarla en un cuarto paquete del monorepo). Junto a
la landing, este bloque entrega el sistema de login/registro real de la
plataforma (Better Auth + adapter Drizzle sobre Postgres), porque las
páginas `/login` y `/register` deben crear y autenticar usuarios de
verdad, no ser un mock de UI.

Incluye también la puesta en marcha de todo el testing del monorepo:
hoy no hay ningún test runner configurado, así que instalar y verificar
Vitest (+ React Testing Library en `apps/panel`, + supertest en
`apps/server`) es trabajo real y temprano de este plan, no un prerequisito
externo ya resuelto.

## Alcance

- Landing de una sola página (`/`) con scroll de secciones: Hero,
  Features, Cómo funciona, Pricing, FAQ, Footer.
- Rutas reales vía React Router: `/`, `/login`, `/register`, `/privacy`,
  `/terms`. Ninguna otra ruta pública de contenido.
- Diseño cuidado y responsive desde esta primera versión (CSS Modules +
  SASS, tokens de marca propios, no el CSS de scaffold de `create-vite`).
- SEO/meta tags/Open Graph básicos (title, description, og:title,
  og:description, og:image) desde este bloque. Sin analytics/tracking
  (pospuesto explícitamente).
- Solo español.
- Auth real de la plataforma: Better Auth con dos proveedores —
  email/password propio y Google OAuth — usando el adapter oficial de
  Drizzle, sesiones en Postgres, montado en `apps/server`. `/login` y
  `/register` son formularios reales contra ese backend, verificados con
  tests de integración contra Postgres real (no mockeado).
- La vinculación de cuenta de Riot (RSO) **no** se construye en este
  bloque; vive en el perfil del usuario en un bloque futuro. El schema de
  Better Auth (tabla `account` soporta múltiples proveedores por usuario)
  no bloquea añadirla después — no requiere ningún trabajo adicional en
  este bloque, solo se deja constancia de que no lo impide.
- Pricing freemium solo visual: Free y Pro (~20€/mes), sin checkout ni
  Stripe. El CTA de Pro lleva al mismo `/register` que el resto.
- Legal: `/privacy` y `/terms` con contenido borrador real (no Lorem
  ipsum), enlazadas desde el registro y el footer.
- Copy de producto redactado en este plan/ejecución (no placeholder),
  basado en `project-overview.md`.

## Decisiones clave del acuerdo (no reabiertas)

1. Landing de una página, sin rutas públicas de contenido adicionales.
2. Fidelidad visual de marca desde ya.
3. Responsive obligatorio desde esta versión.
4. Solo español.
5. SEO/OG básicos sí; analytics/tracking no (pospuesto).
6. React Router instalado en este bloque; rutas: `/`, `/login`,
   `/register`, `/privacy`, `/terms`.
7. Better Auth (email/password + Google, adapter Drizzle, sesiones en
   Postgres) gestiona el login de la plataforma — funcional de verdad,
   no mock de UI. Vive en `apps/server` (ya reflejado en
   `stack-decisions.md` punto 12). RSO/Riot fuera de alcance de este
   bloque.
8. Pricing Free/Pro visual, sin cobro real; diferenciadores del plan Pro:
   más stats/widgets simultáneos, personalización visual avanzada (temas,
   colores, marca propia, sin marca de agua), acceso anticipado al futuro
   editor drag & drop.
9. `/privacy` y `/terms` con contenido borrador genérico pero real.
10. Testing con Vitest + React Testing Library, construido con TDD según
    la skill `tdd`. Instalar y configurar el test runner es trabajo real
    de este plan (no había ninguno configurado en el monorepo).

## Decisiones técnicas de implementación tomadas en este plan (no de producto)

Estas decisiones no reabren el acuerdo — son detalles de implementación
necesarios para ejecutar el acuerdo, no cubiertos por él:

- Better Auth se monta en `apps/server` (Express), expuesto bajo
  `/api/auth/*`; `apps/panel` lo consume vía `better-auth/react`
  (`createAuthClient`) apuntando a la URL del server por variable de
  entorno `VITE_SERVER_URL`.
- Se extrae `apps/server/src/app.ts` (Express `app` sin `.listen()` ni el
  intervalo de Socket.IO) como seam para poder testear las rutas HTTP con
  `supertest` sin levantar un servidor real. `apps/server/src/index.ts`
  pasa a limitarse a arrancar lo que `app.ts` expone.
- Los tests de integración de Better Auth (sign-up/sign-in) corren contra
  una base de datos Postgres real de test (`valoverlay_test`, mismo
  Postgres de `docker-compose.yml`), nunca mockeando Better Auth ni
  Drizzle — solo se permite mockear límites externos/lentos reales
  (p.ej. la config del proveedor Google, que no se puede probar en un
  test sin navegador).
- Estructura de carpetas nueva en `apps/panel/src`: `pages/`,
  `layouts/`, `components/`, `sections/`, `lib/`, `styles/`, `test/`.
- El `App.tsx` actual (fetch de prueba a `/health`, scaffold de
  `create-vite`) se sustituye por completo por el árbol de rutas; no se
  conserva ese fetch de prueba, no formaba parte del acuerdo.

## Fuera de alcance de este bloque

- Checkout/Stripe real para el plan Pro.
- Vinculación de cuenta de Riot (RSO) — bloque futuro (perfil de
  usuario).
- Dashboard de customización con sesión — bloque futuro ("panel de
  gestión").
- Analytics/tracking.
- Overlay, server con datos reales de Valorant, mocks de MSW para datos
  de partida — bloques futuros del roadmap.

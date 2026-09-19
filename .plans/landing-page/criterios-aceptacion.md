# Criterios de aceptación — landing-page

## Setup de verificación

Antes de verificar cualquier AC:

1. Levantar Postgres: `docker compose up -d postgres` desde la raíz del
   repo.
2. Aplicar migraciones de `apps/server` contra la base de datos de
   desarrollo: `pnpm --filter server db:push`.
3. Arrancar el server: `pnpm --filter server dev` (puerto por defecto
   `3050`/`3000` según `PORT`; usar el mismo valor que consuma
   `apps/panel`).
4. Arrancar el panel: `pnpm --filter panel dev` y abrir la URL que
   imprime Vite (por defecto `http://localhost:5173`).
5. No hace falta ningún usuario preexistente: todos los AC de auth crean
   su propio usuario de prueba con un email único (p.ej.
   `qa+<timestamp>@valoverlay.com`) para no chocar con ejecuciones
   previas.
6. Para el AC de Google OAuth solo se verifica que el botón existe y
   dispara el flujo (redirección a Google); completar el login real con
   una cuenta de Google no es parte de este criterio si no hay
   credenciales OAuth de prueba configuradas — en ese caso, verificar que
   al pulsar el botón la app no lanza un error de cliente (network error
   o excepción JS) antes de la redirección.

## AC1 — Landing de una sola página con las 6 secciones

La ruta `/` muestra, en scroll, Hero, Features, Cómo funciona, Pricing,
FAQ y Footer, con copy real (no Lorem ipsum) coherente con el producto
descrito en `project-overview.md`.

- Precondición: ninguna.
- Assert: al visitar `/`, son visibles (mediante scroll) los 6 bloques
  citados, cada uno con un heading o título identificable, y ningún
  bloque contiene texto placeholder tipo "Lorem ipsum" o "TODO".
- On fail: screenshot `/tmp/qa-ac1.png`

## AC2 — Responsive

La landing es usable en viewport móvil sin scroll horizontal ni
contenido cortado.

- Precondición: ninguna.
- Assert: con el viewport en 375x812 (iPhone SE/similar), la página no
  produce scroll horizontal, la navegación del `Header` sigue siendo
  accesible (aunque cambie de forma, p.ej. colapsada), y las secciones
  Hero/Pricing/FAQ se leen sin solaparse ni desbordar el viewport.
- On fail: screenshot `/tmp/qa-ac2.png`

## AC3 — SEO/Open Graph básicos

El HTML servido en `/` incluye título, meta description y meta tags
Open Graph.

- Precondición: ninguna.
- Assert: el `<head>` del documento contiene `<title>` con el nombre del
  producto (no "panel"), `<meta name="description">` con contenido no
  vacío, y `<meta property="og:title">`, `<meta property="og:description">`,
  `<meta property="og:image">` con valores no vacíos. `<html lang="es">`.
- On fail: screenshot `/tmp/qa-ac3.png`

## AC4 — Pricing Free/Pro sin checkout

La sección Pricing muestra los dos planes con los diferenciadores
acordados y ningún flujo de pago.

- Precondición: ninguna.
- Assert: se ven dos tarjetas de plan (Free y Pro, ~20€/mes), la tarjeta
  Pro menciona explícitamente los tres diferenciadores (más
  estadísticas/widgets simultáneos, personalización visual avanzada sin
  marca de agua, acceso anticipado al editor drag & drop), y el CTA de
  ambos planes navega a `/register` (no hay ningún formulario de pago ni
  redirección a un proveedor de cobro).
- On fail: screenshot `/tmp/qa-ac4.png`

## AC5 — Registro real crea un usuario contra Better Auth

Rellenar el formulario de `/register` con datos válidos crea un usuario
real en Postgres y deja al usuario autenticado (o lo redirige a
continuar), sin usar ningún mock de UI.

- Precondición: ninguna (usar un email único no usado antes).
- Assert: al enviar el formulario de `/register` con nombre, email
  nuevo, password válida y checkbox de términos marcado, la app navega
  fuera de `/register` (p.ej. a `/`) y una consulta a la base de datos de
  desarrollo (`SELECT * FROM "user" WHERE email = '<email usado>'`)
  devuelve exactamente una fila con ese email.
- On fail: screenshot `/tmp/qa-ac5.png`

## AC6 — Login real autentica contra Better Auth

Iniciar sesión con el usuario creado en AC5 autentica correctamente; un
email/password incorrecto muestra un error visible.

- Precondición: usuario creado en AC5 (mismo email/password).
- Assert: en `/login`, enviar ese email/password navega fuera de
  `/login`. Repetir con un password incorrecto para el mismo email
  muestra un mensaje de error visible en el formulario y permanece en
  `/login`.
- On fail: screenshot `/tmp/qa-ac6.png`

## AC7 — Guard de invitados

Un usuario ya autenticado no puede volver a ver los formularios de
`/login` ni `/register`.

- Precondición: sesión activa (login hecho en AC6).
- Assert: navegar manualmente a `/login` y a `/register` con la sesión
  activa redirige a `/` en ambos casos, sin mostrar el formulario.
- On fail: screenshot `/tmp/qa-ac7.png`

## AC8 — Enlaces legales

Las páginas `/privacy` y `/terms` existen, tienen contenido real y están
enlazadas desde el footer y desde el registro.

- Precondición: ninguna.
- Assert: `/privacy` y `/terms` cargan contenido específico (qué datos
  se recogen — email, password hasheada, datos de Riot cuando se
  vinculen —, para qué se usan, derecho de borrado), el `Footer` (visible
  en cualquier ruta pública) tiene enlaces a ambas, y el formulario de
  `/register` tiene enlaces a ambas junto al checkbox de aceptación.
- On fail: screenshot `/tmp/qa-ac8.png`

## AC9 — Google OAuth visible y disparado

El botón "Continuar con Google" existe en `/login` y `/register` y
dispara el flujo OAuth de Better Auth.

- Precondición: ninguna.
- Assert: el botón "Continuar con Google" es visible en `/login`; al
  pulsarlo, el navegador es redirigido fuera de `valoverlay`/`localhost`
  hacia un dominio de Google (`accounts.google.com`) sin excepción JS
  previa visible en consola.
- On fail: screenshot `/tmp/qa-ac9.png`

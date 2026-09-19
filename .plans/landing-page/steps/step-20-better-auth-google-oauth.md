# Step 20: Configurar el proveedor Google OAuth en Better Auth

## Tarea

Añadir el proveedor `google` a `socialProviders` en
`apps/server/src/auth.ts` (acuerdo punto 4/8: Better Auth gestiona
login con email/password **y** Google), leyendo `GOOGLE_CLIENT_ID` y
`GOOGLE_CLIENT_SECRET` de variables de entorno. No se puede completar de
extremo a extremo el flujo OAuth real de Google en un test automatizado
(requiere un navegador y una cuenta de Google real — es, por definición,
el límite externo/lento que la skill `tdd` permite no ejercitar
directamente). Lo que sí es responsabilidad de este código y sí se
prueba: que nuestra configuración genera correctamente la URL de
autorización de Google con nuestro `client_id`, es decir, el contrato
que nuestro backend ofrece en su frontera — no la mecánica interna de
Google.

## Criterios de aceptación

- [ ] `auth.ts` configura `socialProviders.google` con `clientId` y
      `clientSecret` desde `process.env`.
- [ ] `POST /api/auth/sign-in/social` con `{ provider: 'google', callbackURL: '...' }`
      responde con una URL de autorización que apunta a
      `accounts.google.com` e incluye el `client_id` configurado.
- [ ] Si `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` no están definidas, el
      servidor no arranca en silencio con Google mal configurado (falla
      de forma explícita al arrancar o dentro de `auth.ts` — decisión de
      implementación; documentar cuál se eligió).

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/server/src/auth.test.ts` (añadir
  `describe('POST /api/auth/sign-in/social (google)')`)
- Requiere `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` definidas en el
  entorno de test con valores ficticios pero estables (p.ej.
  `GOOGLE_CLIENT_ID=test-google-client-id`,
  `GOOGLE_CLIENT_SECRET=test-google-client-secret`, definidas en
  `apps/server/vitest.config.ts` vía `setupFiles` o `env`, sin llegar a
  Google real en ningún momento — no hace falta que sean válidas para
  Google, solo que nuestro código las use correctamente).
- `it('genera una URL de autorización de Google con nuestro client_id')` —
  `supertest(app).post('/api/auth/sign-in/social').send({ provider: 'google', callbackURL: 'http://localhost:5173/' })`,
  `res.status === 200`, `res.body.url` empieza por
  `https://accounts.google.com` y contiene
  `client_id=test-google-client-id` (o el parámetro equivalente que use
  Better Auth — confirmar el nombre exacto del query param al ejecutar
  el test la primera vez). Antes de este step, `google` no está en
  `socialProviders`, así que Better Auth responde con un error de
  proveedor no soportado y el test falla.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando:
`docker compose up -d postgres && DATABASE_URL=postgres://valoverlay:valoverlay@localhost:5432/valoverlay_test pnpm --filter server test`

## Ficheros afectados

- `apps/server/src/auth.ts` — añade `socialProviders.google`.
- `apps/server/vitest.config.ts` — define `GOOGLE_CLIENT_ID`/
  `GOOGLE_CLIENT_SECRET` ficticias para el entorno de test.
- `.env.example` (creado en el step 17) — documenta
  `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` como variables requeridas
  para desarrollo/producción (valores reales los aporta el usuario fuera
  de este plan, en la consola de Google Cloud — no es parte de este
  bloque conseguir credenciales reales de Google, solo dejar el código
  listo para usarlas).
- `apps/server/src/auth.test.ts` — test descrito arriba.

## Skills necesarias

- tdd — el límite exacto de lo que se prueba (nuestra URL generada, no
  el login real en Google) es una aplicación directa de "testea el
  contrato de tu frontera, no la mecánica interna de la dependencia".

## Commits de este step

test: Añadir test en rojo de la URL de autorización de Google
feat: Configurar el proveedor Google OAuth en Better Auth

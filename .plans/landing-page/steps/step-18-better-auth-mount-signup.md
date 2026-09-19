# Step 18: Montar el handler de Better Auth en Express y probar el registro real (sign-up)

## Tarea

Montar el handler HTTP de Better Auth
(`toNodeHandler` de `better-auth/node`) en `apps/server/src/app.ts`
(el seam creado en el step 02), bajo `/api/auth/*`, apuntando a la
instancia `auth` del step 17. **Importante (requisito conocido de
Better Auth con Express):** el handler de Better Auth debe montarse
**antes** de `express.json()` en la cadena de middlewares — Better Auth
necesita leer el body sin parsear; si `express.json()` ya consumió el
stream, Better Auth falla. Ajustar el orden de middlewares en `app.ts`
en consecuencia.

También se ajusta `cors()`: de `cors()` (todo permitido) a
`cors({ origin: process.env.PANEL_ORIGIN ?? 'http://localhost:5173', credentials: true })`,
necesario para que las cookies de sesión de Better Auth viajen entre
`apps/panel` (origen distinto) y `apps/server`.

Este step conecta por primera vez con la base de datos de test real
(`valoverlay_test`, creada en el step 17): se añade un helper de
limpieza (`apps/server/src/test/db.ts`) que trunca las tablas de auth
después de cada test, y se configura Vitest para leer
`TEST_DATABASE_URL` como `DATABASE_URL` en el proceso de test (o se
inyecta explícitamente en el `db` de test — decisión de implementación:
la más simple es que `apps/server/vitest.config.ts` cargue un
`setupFiles` que haga `process.env.DATABASE_URL = process.env.TEST_DATABASE_URL`
antes de que `src/db/index.ts` se importe en ningún test).

## Criterios de aceptación

- [ ] `POST /api/auth/sign-up/email` con `{ email, password, name }`
      válidos responde 200/201 y crea una fila real en la tabla `user`
      de `valoverlay_test`.
- [ ] La respuesta incluye una cookie de sesión (`set-cookie`).
- [ ] Repetir el mismo `email` en un segundo `sign-up` responde con un
      error (no crea un segundo usuario duplicado).
- [ ] `apps/server/src/index.ts` (el server real) sigue arrancando y
      sirviendo `/health` sin cambios de comportamiento.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/server/src/auth.test.ts`
- Usa `beforeEach`/`afterEach` (definidos vía el helper
  `apps/server/src/test/db.ts`) para limpiar las tablas `user`,
  `session`, `account`, `verification` de `valoverlay_test` antes de
  cada test, de forma que los tests sean independientes del orden.
- `describe('POST /api/auth/sign-up/email')`:
  - `it('crea un usuario real en la base de datos')` —
    `supertest(app).post('/api/auth/sign-up/email').send({ email: 'qa+signup@valoverlay.test', password: 'Contraseña123!', name: 'QA' })`,
    comprueba `res.status` en `[200, 201]`, y hace una consulta directa
    con Drizzle (`db.select().from(user).where(eq(user.email, 'qa+signup@valoverlay.test'))`)
    que devuelve exactamente 1 fila. No se mockea Better Auth ni
    Drizzle — es un test de integración contra Postgres real, tal como
    exige el acuerdo ("esto debe estar funcionando de verdad").
    Antes de este step, la ruta `/api/auth/*` no existe en `app.ts`
    (falla con 404), así que el test falla.
  - `it('la respuesta incluye una cookie de sesión')` —
    mismo `POST` con un email distinto,
    `res.headers['set-cookie']` no es `undefined`.
  - `it('rechaza un email duplicado')` — dos `POST` consecutivos con el
    mismo email; el segundo responde con `res.status >= 400` y la
    consulta a `user` sigue devolviendo exactamente 1 fila para ese
    email.

## Criterio de verde

Todos los tests del paso pasan (contra `valoverlay_test` real, con
Postgres levantado vía `docker compose up -d postgres`) + linter
limpio.
Comando:
`docker compose up -d postgres && DATABASE_URL=postgres://valoverlay:valoverlay@localhost:5432/valoverlay_test pnpm --filter server test`

## Ficheros afectados

- `apps/server/src/app.ts` — monta `app.all('/api/auth/*', toNodeHandler(auth))`
  antes de `express.json()`; ajusta `cors()` con `credentials: true` y
  `origin` configurable por `PANEL_ORIGIN`.
- `apps/server/src/test/db.ts` — nuevo, helper de limpieza de tablas de
  auth entre tests (`TRUNCATE "user", session, account, verification CASCADE`
  o `DELETE FROM` en el orden correcto por FKs).
- `apps/server/vitest.config.ts` — `setupFiles` que fuerza
  `DATABASE_URL` de test si no viene ya definida por el comando que
  lanza el test.
- `apps/server/src/auth.test.ts` — nuevo, tests descritos arriba.

## Skills necesarias

- tdd — ciclo rojo/verde del endpoint de sign-up, contra Postgres real
  (mock solo en el límite que corresponde: ninguno en este step, porque
  Postgres real y local no es "lento ni externo" en el sentido que
  justificaría mockearlo).

## Commits de este step

test: Añadir tests en rojo de sign-up contra Better Auth
feat: Montar Better Auth en Express bajo /api/auth

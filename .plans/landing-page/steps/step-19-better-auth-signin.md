# Step 19: Probar el login real (sign-in) contra Better Auth

## Tarea

El endpoint `POST /api/auth/sign-in/email` ya existe de forma implícita
en cuanto Better Auth está montado (step 18) — Better Auth expone todas
sus rutas de golpe al montar el handler, no ruta por ruta. Este step no
añade código de producción nuevo salvo, si hiciera falta, ajustes
menores de configuración de `auth.ts` que el comportamiento de sign-in
revele como necesarios (p.ej. `session.expiresIn` u otra opción por
defecto que Better Auth requiera explícitamente para emitir cookies de
sign-in correctamente — a confirmar contra el comportamiento real al
ejecutar el test). El grueso de este step es **extender la cobertura de
test** al flujo de login, que hasta el step 18 no estaba probado.

## Criterios de aceptación

- [ ] `POST /api/auth/sign-in/email` con las credenciales de un usuario
      creado previamente responde 200 y una cookie de sesión.
- [ ] `POST /api/auth/sign-in/email` con password incorrecto responde
      con error (4xx) y sin cookie de sesión válida.
- [ ] `POST /api/auth/sign-in/email` con un email que no existe responde
      con error (4xx).

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/server/src/auth.test.ts` (añadir al fichero del
  step 18, mismo `describe` de nivel superior o uno nuevo
  `describe('POST /api/auth/sign-in/email')`)
- Cada test crea primero su propio usuario vía
  `POST /api/auth/sign-up/email` (helper compartido, p.ej.
  `createTestUser(email, password)` en `apps/server/src/test/db.ts` o
  un fichero de test-utils dedicado) para no depender del orden de
  ejecución de otros tests ni de fixtures precargados.
  - `it('autentica con email y password correctos')` —
    `sign-up` de un usuario, luego
    `supertest(app).post('/api/auth/sign-in/email').send({ email, password })`,
    `res.status === 200` y `res.headers['set-cookie']` presente.
    Antes de este step no hay ningún test que ejercite `sign-in`, así
    que la primera vez que se escribe falla si hay cualquier problema de
    configuración de `auth.ts` no cubierto por el step 18 (p.ej. algo
    específico de la emisión de cookies en sign-in vs. sign-up) — si el
    test pasa a la primera sin ningún cambio de producción, es una señal
    de alarma según la skill `tdd` ("el test pasa a la primera") y hay
    que revisar si realmente está ejercitando el endpoint real (comprobar
    con un `console.log` temporal de `res.status`/`res.body` antes de
    aceptar el verde, y quitarlo después).
  - `it('rechaza un password incorrecto')` — `sign-up` de un usuario,
    luego `sign-in` con password distinto; `res.status >= 400`.
  - `it('rechaza un email que no existe')` — `sign-in` directo con un
    email nunca registrado; `res.status >= 400`.

## Criterio de verde

Todos los tests del paso pasan (contra `valoverlay_test` real) + linter
limpio.
Comando:
`docker compose up -d postgres && DATABASE_URL=postgres://valoverlay:valoverlay@localhost:5432/valoverlay_test pnpm --filter server test`

## Ficheros afectados

- `apps/server/src/auth.test.ts` — tests de sign-in descritos arriba.
- `apps/server/src/test/db.ts` (o un nuevo `apps/server/src/test/auth-helpers.ts`) —
  helper `createTestUser` reutilizado por los tests de sign-in.
- `apps/server/src/auth.ts` — solo si el comportamiento real revela que
  hace falta algún ajuste de configuración explícito; si no hace falta
  ningún cambio, este fichero no se toca en este step.

## Skills necesarias

- tdd — especial atención a la señal de alarma "el test pasa a la
  primera": si el sign-in funciona sin ningún cambio de producción tras
  el step 18, hay que confirmar que el test realmente ejercita el
  endpoint (y no, por ejemplo, un `try/catch` que traga el error) antes
  de darlo por bueno.

## Commits de este step

test: Añadir tests en rojo de sign-in contra Better Auth
feat: Ajustar configuración de Better Auth para sign-in si hiciera falta

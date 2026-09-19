# Step 02: Instalar Vitest + supertest en apps/server, extrayendo un `app.ts` testable

## Tarea

Instalar Vitest (entorno `node`, sin jsdom) y `supertest` en
`apps/server`. Antes de poder testear cualquier ruta HTTP, hace falta un
**seam**: hoy `apps/server/src/index.ts` construye el `app` de Express y,
en el mismo fichero y al nivel superior del módulo, llama a
`httpServer.listen(...)` y arranca un `setInterval` que emite ticks de
Socket.IO — ambos son efectos secundarios que se dispararían con solo
`import`ar el fichero desde un test (bindear un puerto real, dejar un
timer corriendo). Este step extrae la construcción del `app` de Express
(sin `.listen()`, sin Socket.IO, sin el intervalo) a un módulo nuevo
`apps/server/src/app.ts`, que es lo único que los tests importan.

`apps/server/src/index.ts` pasa a limitarse a: importar `app` de
`./app.js`, montar `httpServer`/`io`/el intervalo de tick (igual que
hoy) y llamar a `.listen()`. El comportamiento en producción no cambia.

## Criterios de aceptación

- [ ] `pnpm --filter server test` ejecuta Vitest y termina en verde.
- [ ] Importar `apps/server/src/app.ts` en un test no bindea ningún
      puerto ni deja timers activos.
- [ ] `apps/server/src/index.ts` sigue arrancando el servidor real igual
      que antes (`pnpm --filter server dev` sigue sirviendo `/health` y
      `/db-health`, y el tick de Socket.IO sigue emitiéndose).
- [ ] `pnpm --filter server build` sigue compilando sin errores.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/server/src/app.test.ts`
- `describe('app')` → `it('responde 200 y { status: "ok" } en GET /health')`
- Antes de este step, `apps/server/src/app.ts` no existe, así que este
  test falla por error de import (`Cannot find module './app.js'` o
  equivalente) — el mismo tipo de "rojo por ausencia de módulo" que en
  el step 01 (el runner tampoco existe todavía, pero al añadirlo en este
  mismo step el primer fallo real observable es el import faltante de
  `app.ts`).
- El test usa `supertest(app).get('/health')` (import real de
  `../app.js`, sin mockear nada) y comprueba `res.status === 200` y
  `res.body` igual a `{ status: 'ok' }`. Esto ejercita código real (la
  ruta `/health` ya existente), pero el seam (`app.ts` separado de
  `index.ts`) es lo que hace posible testearlo sin arrancar el server
  completo — es la parte de producción que este step realmente añade.
- No se testea `/db-health` en este step (requiere Postgres real
  disponible en CI/local de forma consistente y no aporta nada nuevo al
  seam que se está demostrando); se retoma la base de datos real en los
  steps de Better Auth (17-19), donde sí es imprescindible.

## Criterio de verde

Todos los tests del paso pasan + linter limpio (no hay linter TS
dedicado además de `tsc`, así que el criterio de verde es tests +
compilación).
Comando: `pnpm --filter server test && pnpm --filter server build`

## Ficheros afectados

- `apps/server/package.json` — añadir devDependencies (`vitest`,
  `supertest`, `@types/supertest`) y script `"test": "vitest run"`.
- `apps/server/vitest.config.ts` — nuevo, config mínima de Vitest
  (`environment: 'node'`).
- `apps/server/src/app.ts` — nuevo. Construye y exporta `app` (Express):
  `cors()`, `express.json()` si aplica, y las rutas `GET /health` y
  `GET /db-health` tal como existen hoy en `index.ts`. No incluye
  `createServer`, `Server` de socket.io, `DEV_TOKEN`, el listener `io.on`
  ni el `setInterval`.
- `apps/server/src/index.ts` — se reduce a: importar `app` de `./app.js`,
  crear `httpServer = createServer(app)`, montar `io`, el listener
  `join` y el `setInterval` del tick, y llamar a
  `httpServer.listen(port, ...)`. Comportamiento idéntico al actual.
- `apps/server/src/app.test.ts` — nuevo, test descrito arriba.

## Skills necesarias

- tdd — el seam (separar `app.ts` de `index.ts`) es exactamente el tipo
  de identificación de "punto donde se puede inyectar/observar
  comportamiento sin arrastrar efectos secundarios lentos o externos"
  que pide la skill antes de escribir el primer test de una pieza nueva
  de infraestructura de testing.

## Commits de este step

test: Añadir test de humo de Vitest en apps/server
refactor: Extraer app de Express a apps/server/src/app.ts

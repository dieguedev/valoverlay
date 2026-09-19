# Step 01: Instalar y configurar Vitest + React Testing Library en apps/panel

## Tarea

Instalar y configurar el test runner en `apps/panel`: Vitest en entorno
`jsdom`, React Testing Library (RTL), `@testing-library/jest-dom` (para
matchers de DOM) y `@testing-library/user-event`. Añadir el script
`test` a `apps/panel/package.json`. Este es el primer test runner que
existe en todo el monorepo (confirmado en `investigacion.md`): sin este
step no se puede escribir ningún test en rojo de los steps siguientes de
`apps/panel`.

No se implementa ninguna funcionalidad de producto en este step.

## Criterios de aceptación

- [ ] `pnpm --filter panel test` ejecuta Vitest y termina en verde.
- [ ] El entorno de test es `jsdom` (se puede usar `document`/`render` de
      RTL sin errores).
- [ ] `@testing-library/jest-dom` está registrado globalmente (matchers
      como `toBeInTheDocument()` disponibles sin importarlos en cada
      fichero de test).
- [ ] `oxlint` sigue pasando sin warnings nuevos sobre los ficheros
      añadidos.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

No aplica un ciclo rojo→verde de comportamiento de producto: este step
instala y configura infraestructura de testing, no hay lógica de
producción nueva que testear (excepción explícita de la skill `tdd`:
"ficheros de configuración").

En su lugar, el criterio de verde se demuestra con un **test de humo**
que confirma que el runner funciona de verdad (se ejecuta, usa jsdom,
RTL renderiza) contra código real ya existente en el repo:

- Fichero de test: `apps/panel/src/App.test.tsx`
- `describe('App')` → `it('renderiza el estado del servidor')`
- Antes de este step, este fichero no existe y `pnpm --filter panel test`
  falla porque no hay ningún script `test` definido (falla el comando,
  no el test) — es la forma de "rojo" válida para un step de tooling:
  el comando no puede ni ejecutarse.
- El test renderiza el `App` actual (`apps/panel/src/App.tsx`, el que
  hace `fetch` a `/health`) con `render()` de RTL y comprueba con
  `screen.getByText(/server status/i)` que el texto inicial
  ("server status: loading...") aparece en el DOM. No se mockea `fetch`
  explícitamente en este step: si `fetch` no está definido en jsdom para
  esta versión, usar `vi.stubGlobal('fetch', vi.fn(() => Promise.reject()))`
  únicamente para evitar una excepción no controlada en el `useEffect`,
  no para verificar ningún comportamiento del mock — el único assert
  real es sobre el texto inicial ya renderizado de forma síncrona.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/package.json` — añadir devDependencies (`vitest`,
  `@testing-library/react`, `@testing-library/jest-dom`,
  `@testing-library/user-event`, `jsdom`) y script
  `"test": "vitest run"`.
- `apps/panel/vite.config.ts` — añadir bloque `test` de Vitest
  (`environment: 'jsdom'`, `globals: true`,
  `setupFiles: './src/test/setup.ts'`). Requiere el triple-slash
  `/// <reference types="vitest/config" />` o equivalente para que TS
  reconozca la opción `test` en `defineConfig`.
- `apps/panel/src/test/setup.ts` — nuevo, `import '@testing-library/jest-dom'`.
- `apps/panel/src/App.test.tsx` — nuevo, test de humo descrito arriba.
- `apps/panel/tsconfig.app.json` — si hace falta, añadir `"types": ["vitest/globals", "@testing-library/jest-dom"]`.

## Skills necesarias

- tdd — para justificar explícitamente por qué este step no sigue el
  ciclo rojo/verde de comportamiento (excepción de fichero de
  configuración) y en qué consiste el test de humo que sí se exige.

## Commits de este step

test: Añadir test de humo de Vitest en apps/panel
feat: Configurar Vitest y React Testing Library en apps/panel

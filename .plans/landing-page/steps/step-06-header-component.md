# Step 06: Componente `Header` (logo + navegación + CTAs a login/register)

## Tarea

Crear el componente `Header` (`apps/panel/src/components/Header/Header.tsx`
+ `Header.module.scss`, usando los tokens del step 03): logo/nombre de
producto que enlaza a `/`, y dos CTAs — "Iniciar sesión" (enlaza a
`/login`) y "Crear cuenta" (enlaza a `/register`) — usando `Link` de
React Router. Este component se construye y testea de forma aislada
(sin montarlo todavía en `PublicLayout`, eso es el step 08).

## Criterios de aceptación

- [ ] `Header` renderiza un enlace al home (logo/nombre) con `href="/"`.
- [ ] `Header` renderiza un enlace "Iniciar sesión" con `href="/login"`.
- [ ] `Header` renderiza un enlace "Crear cuenta" con `href="/register"`.
- [ ] Responsive: en viewport estrecho el contenido no desborda (se
      verifica visualmente en QA, no por test unitario — ver
      `criterios-aceptacion.md` AC2).

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/components/Header/Header.test.tsx`
- `describe('Header')`:
  - `it('enlaza el logo al home')` — `render(<MemoryRouter><Header /></MemoryRouter>)`,
    `screen.getByRole('link', { name: /valoverlay/i })` con
    `href="/"`. Falla porque `Header` no existe todavía.
  - `it('enlaza a iniciar sesión')` —
    `screen.getByRole('link', { name: /iniciar sesión/i })` con
    `href="/login"`.
  - `it('enlaza a crear cuenta')` —
    `screen.getByRole('link', { name: /crear cuenta/i })` con
    `href="/register"`.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/components/Header/Header.tsx` — nuevo.
- `apps/panel/src/components/Header/Header.module.scss` — nuevo, usa
  `@use '../../styles/tokens' as *;`.
- `apps/panel/src/components/Header/Header.test.tsx` — nuevo, tests
  descritos arriba.

## Skills necesarias

- tdd — ciclo rojo/verde del componente.
- frontend-design — para la composición visual del header (jerarquía
  logo/CTAs, no un navbar genérico de plantilla).

## Commits de este step

test: Añadir tests en rojo del componente Header
feat: Implementar el componente Header

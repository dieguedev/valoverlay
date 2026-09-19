# Step 07: Componente `Footer` (enlaces legales + copyright)

## Tarea

Crear el componente `Footer` (`apps/panel/src/components/Footer/Footer.tsx`
+ `Footer.module.scss`): enlaces a `/privacy` y `/terms` (requisito
explícito del acuerdo, punto 10 — el footer debe enlazar las páginas
legales) y una línea de copyright con el nombre del producto. Se
construye y testea aislado, igual que `Header` (la integración en
`PublicLayout` es el step 08).

## Criterios de aceptación

- [ ] `Footer` renderiza un enlace a `/privacy`.
- [ ] `Footer` renderiza un enlace a `/terms`.
- [ ] `Footer` muestra el nombre del producto en el texto de copyright.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/components/Footer/Footer.test.tsx`
- `describe('Footer')`:
  - `it('enlaza a la política de privacidad')` —
    `render(<MemoryRouter><Footer /></MemoryRouter>)`,
    `screen.getByRole('link', { name: /privacidad/i })` con
    `href="/privacy"`. Falla porque `Footer` no existe todavía.
  - `it('enlaza a los términos y condiciones')` —
    `screen.getByRole('link', { name: /términos/i })` con
    `href="/terms"`.
  - `it('muestra el nombre del producto en el copyright')` —
    `screen.getByText(/valoverlay/i)` presente en el footer.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/components/Footer/Footer.tsx` — nuevo.
- `apps/panel/src/components/Footer/Footer.module.scss` — nuevo.
- `apps/panel/src/components/Footer/Footer.test.tsx` — nuevo, tests
  descritos arriba.

## Skills necesarias

- tdd — ciclo rojo/verde del componente.

## Commits de este step

test: Añadir tests en rojo del componente Footer
feat: Implementar el componente Footer

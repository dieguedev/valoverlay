# Step 08: Integrar `Header` y `Footer` en `PublicLayout`

## Tarea

`PublicLayout` (creado en el step 04 como un simple `<Outlet />` de
paso) pasa a montar `Header` arriba y `Footer` abajo del contenido
enrutado, de forma que las 5 rutas públicas (`/`, `/login`, `/register`,
`/privacy`, `/terms`) comparten la misma navegación y el mismo footer.

## Criterios de aceptación

- [ ] Visitar cualquiera de las 5 rutas públicas muestra el `Header` con
      sus 3 enlaces y el `Footer` con sus enlaces legales, además del
      contenido propio de la ruta.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/layouts/PublicLayout.test.tsx`
- `describe('PublicLayout')`:
  - `it('muestra el Header y el Footer junto al contenido de la ruta activa')` —
    `render(<MemoryRouter initialEntries={['/']}><Routes><Route element={<PublicLayout />}><Route path="/" element={<p>contenido de prueba</p>} /></Route></Routes></MemoryRouter>)`,
    comprueba que están presentes `screen.getByRole('link', { name: /iniciar sesión/i })`
    (del `Header`) y `screen.getByRole('link', { name: /privacidad/i })`
    (del `Footer`), además de `screen.getByText('contenido de prueba')`.
    Antes de implementar, `PublicLayout` solo renderiza `<Outlet />` sin
    `Header`/`Footer`, así que los `getByRole` de header/footer no
    encuentran nada y el test falla.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/layouts/PublicLayout.tsx` — añade `<Header />` antes
  del `<Outlet />` y `<Footer />` después.
- `apps/panel/src/layouts/PublicLayout.module.scss` — nuevo, estructura
  básica (`min-height: 100vh`, footer empujado al fondo si el contenido
  es corto).
- `apps/panel/src/layouts/PublicLayout.test.tsx` — nuevo, test descrito
  arriba.

## Skills necesarias

- tdd — ciclo rojo/verde de la integración.

## Commits de este step

test: Añadir test en rojo de Header y Footer en PublicLayout
feat: Integrar Header y Footer en PublicLayout

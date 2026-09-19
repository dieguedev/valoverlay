# Step 04: Instalar React Router y definir las 5 rutas públicas con páginas placeholder

## Tarea

Instalar `react-router-dom` en `apps/panel` (decisión ya tomada en el
acuerdo, punto 7) y definir el árbol de rutas público: `/`, `/login`,
`/register`, `/privacy`, `/terms`. Se crea `PublicLayout`
(`apps/panel/src/layouts/PublicLayout.tsx`), un layout de paso (`<Outlet />`
sin `Header`/`Footer` todavía — eso llega en el step 08) que envuelve las
5 rutas. Se crean las 5 páginas como placeholders mínimos (un heading
distintivo por página, sin contenido de producto todavía — el contenido
real llega en los steps 09-16 y 22-23).

`apps/panel/src/App.tsx` deja de contener el fetch de prueba a
`/health` (scaffold de `create-vite` sin relación con la landing, según
lo acordado en el resumen del bloque) y pasa a montar el router.

## Criterios de aceptación

- [ ] Visitar `/`, `/login`, `/register`, `/privacy`, `/terms` renderiza
      la página correspondiente (heading distintivo por ruta).
- [ ] Una ruta no definida (`/ruta-inexistente`) no rompe la app (puede
      redirigir a `/` o mostrar un placeholder 404 mínimo — decisión
      libre de implementación, no estaba en el acuerdo un diseño de 404
      específico).
- [ ] El fetch de prueba a `/health` desaparece de `App.tsx`.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/App.test.tsx` (se reemplaza el
  contenido del step 01, que testeaba el `App.tsx` de scaffold — ese
  comportamiento deja de existir por diseño de este step)
- `describe('rutas públicas')`:
  - `it('renderiza la página de inicio en /')`
  - `it('renderiza la página de login en /login')`
  - `it('renderiza la página de registro en /register')`
  - `it('renderiza la página de privacidad en /privacy')`
  - `it('renderiza la página de términos en /terms')`
- Antes de implementar, estos tests fallan porque `App.tsx` no monta
  ningún router (no hay `react-router-dom` instalado ni configurado) —
  intentar renderizar `<MemoryRouter initialEntries={['/login']}><App /></MemoryRouter>`
  no encuentra ningún heading distintivo de login porque `App` sigue
  siendo el componente de fetch a `/health`.
- Cada test usa `render(<MemoryRouter initialEntries={[ruta]}><App /></MemoryRouter>)`
  de RTL y comprueba con `screen.getByRole('heading', { name: /texto esperado/i })`
  que el heading distintivo de esa página está presente. Los textos
  exactos de los headings los define quien implemente (p.ej. "Inicio",
  "Iniciar sesión", "Crear cuenta", "Política de privacidad",
  "Términos y condiciones"), consistentes con los que van a reutilizar
  los steps 15/16/22/23 al dar contenido real a esas páginas.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/package.json` — añadir dependency `react-router-dom`.
- `apps/panel/src/App.tsx` — reemplazado: monta `<BrowserRouter>` (o
  `<RouterProvider>` con `createBrowserRouter`, a elección de quien
  implemente) con las 5 rutas dentro de `PublicLayout`. Se elimina el
  fetch a `/health` y su estado.
- `apps/panel/src/layouts/PublicLayout.tsx` — nuevo, `<Outlet />` sin
  estilos ni Header/Footer todavía.
- `apps/panel/src/pages/HomePage.tsx` — nuevo, placeholder con heading.
- `apps/panel/src/pages/LoginPage.tsx` — nuevo, placeholder con heading.
- `apps/panel/src/pages/RegisterPage.tsx` — nuevo, placeholder con
  heading.
- `apps/panel/src/pages/PrivacyPage.tsx` — nuevo, placeholder con
  heading.
- `apps/panel/src/pages/TermsPage.tsx` — nuevo, placeholder con heading.
- `apps/panel/src/App.test.tsx` — reemplazado por los 5 tests descritos
  arriba (se retira el test de humo del step 01, ya no aplica porque el
  `App.tsx` que testeaba deja de existir).

## Skills necesarias

- tdd — para el ciclo rojo/verde de cada ruta.

## Commits de este step

test: Añadir tests en rojo de las rutas públicas
feat: Instalar React Router y definir las rutas públicas con páginas placeholder

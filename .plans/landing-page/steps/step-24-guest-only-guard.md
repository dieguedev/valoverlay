# Step 24: Guard "solo invitados" que redirige `/login` y `/register` si ya hay sesión

## Tarea

Crear `GuestOnlyRoute` (`apps/panel/src/components/GuestOnlyRoute/GuestOnlyRoute.tsx`),
un componente que envuelve una página y usa `authClient.useSession()`
(step 21) para decidir qué renderizar:

- Si la sesión está cargando (`isPending`/`isLoading`, según el shape
  real del hook — confirmar contra la librería real al implementar) →
  no renderiza el formulario todavía (puede no renderizar nada o un
  estado de carga mínimo; decisión libre, no fijada en el acuerdo).
- Si hay sesión activa (`data.user` presente) → redirige a `/` con
  `<Navigate to="/" replace />`, sin renderizar los `children`.
- Si no hay sesión → renderiza los `children` normalmente.

Se envuelve `LoginPage` y `RegisterPage` con `GuestOnlyRoute` en la
configuración de rutas de `App.tsx`.

**Ambigüedad explícita a señalar, no decidida aquí:** este bloque no
construye ningún dashboard ni ninguna ruta protegida que requiera
sesión (eso es el bloque futuro "panel de gestión", según el acuerdo y
`project-overview.md`) — por tanto no existe todavía un
`RequireAuthRoute`/guard equivalente en sentido contrario, y no se
construye en este step. `GuestOnlyRoute` es el único guard de este
bloque; su lógica es fácilmente invertible cuando llegue el bloque del
dashboard, pero esa inversión no es parte de este plan.

## Criterios de aceptación

- [ ] Sin sesión activa, `/login` y `/register` muestran sus
      formularios con normalidad.
- [ ] Con sesión activa, navegar a `/login` o `/register` redirige a
      `/` sin mostrar el formulario.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/components/GuestOnlyRoute/GuestOnlyRoute.test.tsx`
- `vi.mock('../../lib/auth-client', () => ({ authClient: { useSession: vi.fn() } }))`.
- `describe('GuestOnlyRoute')`:
  - `it('renderiza los children cuando no hay sesión activa')` —
    el mock de `useSession` devuelve `{ data: null, isPending: false }`;
    `render(<MemoryRouter><Routes><Route path="/" element={<GuestOnlyRoute><p>formulario</p></GuestOnlyRoute>} /></Routes></MemoryRouter>)`;
    `screen.getByText('formulario')` visible. Falla porque
    `GuestOnlyRoute` no existe todavía.
  - `it('redirige a home cuando hay sesión activa')` — el mock de
    `useSession` devuelve `{ data: { user: { id: '1', email: 'a@a.com' } }, isPending: false }`;
    se renderiza dentro de un `MemoryRouter` con ambas rutas (`/` con un
    marcador de texto "home" y la ruta protegida con
    `GuestOnlyRoute`), iniciando en la ruta protegida; tras el render,
    `screen.getByText('home')` visible y `screen.queryByText('formulario')`
    ausente.
  - `it('no renderiza los children mientras la sesión está cargando')` —
    el mock de `useSession` devuelve `{ data: undefined, isPending: true }`;
    `screen.queryByText('formulario')` ausente (aún no se sabe si hay
    sesión o no, así que tampoco se muestra el formulario todavía —
    evita un parpadeo de formulario→redirección).
- Test de integración adicional en `apps/panel/src/App.test.tsx`:
  - `it('/login y /register están protegidas por GuestOnlyRoute')` —
    verificación mínima de que `App.tsx` envuelve esas dos rutas con el
    guard (puede verificarse renderizando `App` con el mock de
    `useSession` en estado "con sesión" y comprobando que `/login`
    redirige, igual que en el segundo `it` de arriba pero a través del
    árbol de rutas real de la aplicación, no de un árbol de rutas de
    prueba aislado).

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/components/GuestOnlyRoute/GuestOnlyRoute.tsx` — nuevo.
- `apps/panel/src/components/GuestOnlyRoute/GuestOnlyRoute.test.tsx` —
  nuevo, tests descritos arriba.
- `apps/panel/src/App.tsx` — envuelve las rutas `/login` y `/register`
  con `<GuestOnlyRoute>`.
- `apps/panel/src/App.test.tsx` — test de integración descrito arriba.

## Skills necesarias

- tdd — ciclo rojo/verde del guard, incluyendo el estado intermedio de
  carga (caso límite explícito, no solo los dos casos felices).

## Commits de este step

test: Añadir tests en rojo del guard GuestOnlyRoute
feat: Implementar GuestOnlyRoute y proteger login/register

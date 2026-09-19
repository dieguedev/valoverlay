# Step 23: Página `/login` funcional contra Better Auth (email/password + Google)

## Tarea

`LoginPage` (placeholder desde el step 04) pasa a tener un formulario
real: email, password, botón "Iniciar sesión" y botón "Continuar con
Google". Al enviar el formulario de email/password:

- Campos vacíos → error de validación en cliente, sin llamar a
  `authClient`.
- Válido → llama a `authClient.signIn.email({ email, password })`.
  - Éxito → navega a `/`.
  - Error → muestra el mensaje de error de Better Auth (p.ej.
    "Email o contraseña incorrectos") sin navegar.

Al pulsar "Continuar con Google" → llama a
`authClient.signIn.social({ provider: 'google', callbackURL: '/' })`
(no se comprueba la redirección real a Google en este test — eso es
responsabilidad del navegador real, verificado manualmente en
`criterios-aceptacion.md` AC9; el test solo comprueba que el botón
dispara la llamada correcta).

Mismo criterio de mockeo que en el step 22: se mockea `authClient` en
el límite de red, no la lógica propia del formulario.

## Criterios de aceptación

- [ ] El formulario tiene campos email y password, botón "Iniciar
      sesión" y botón "Continuar con Google".
- [ ] Campos vacíos bloquean el envío con un error visible.
- [ ] Envío válido llama a `authClient.signIn.email` con los datos del
      formulario.
- [ ] Éxito navega fuera de `/login`.
- [ ] Error de Better Auth se muestra sin navegar.
- [ ] El botón de Google llama a `authClient.signIn.social` con
      `provider: 'google'`.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/pages/LoginPage.test.tsx`
- `vi.mock('../lib/auth-client', () => ({ authClient: { signIn: { email: vi.fn(), social: vi.fn() } } }))`.
- `describe('LoginPage')`:
  - `it('bloquea el envío con campos vacíos')` — pulsa "Iniciar sesión"
    sin rellenar nada; error visible, `signIn.email` no llamado. Falla
    porque `LoginPage` es aún el placeholder del step 04.
  - `it('llama a signIn.email con los datos del formulario al enviar válido')` —
    rellena email/password, envía; el mock se llamó con
    `{ email, password }` iguales a los introducidos.
  - `it('navega fuera de /login cuando el login tiene éxito')` — el mock
    resuelve con éxito; tras el submit, navegación a `/` verificada
    (mismo patrón que el step 22: destino visible o spy de
    `useNavigate`).
  - `it('muestra el error de Better Auth sin navegar cuando el login falla')` —
    el mock resuelve con `{ data: null, error: { message: 'Email o contraseña incorrectos' } }`;
    error visible, sin navegación.
  - `it('el botón de Google llama a signIn.social con el proveedor google')` —
    pulsa "Continuar con Google"; el mock `signIn.social` se llamó con
    un objeto cuyo `provider` es `'google'` (comprobación de argumento
    exacto, no solo "fue llamado").

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/pages/LoginPage.tsx` — formulario completo con estado
  local, validación, llamadas a `authClient.signIn.email` y
  `authClient.signIn.social`, manejo de éxito/error, `<Seo />`.
- `apps/panel/src/pages/LoginPage.module.scss` — nuevo.
- `apps/panel/src/pages/LoginPage.test.tsx` — nuevo, tests descritos
  arriba.

## Skills necesarias

- tdd — ciclo rojo/verde del formulario, mismo criterio de mockeo en el
  límite de red que el step 22.

## Commits de este step

test: Añadir tests en rojo del formulario de login
feat: Implementar el formulario de login contra Better Auth

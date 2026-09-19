# Step 22: Página `/register` funcional contra Better Auth

## Tarea

`RegisterPage` (placeholder desde el step 04) pasa a tener un
formulario real: nombre, email, password, confirmar password, y un
checkbox "Acepto la política de privacidad y los términos y
condiciones" con enlaces a `/privacy` y `/terms` (requisito explícito
del acuerdo punto 10). Al enviar:

- Si las passwords no coinciden → error de validación en cliente, sin
  llamar a `authClient`.
- Si el checkbox no está marcado → error de validación en cliente, sin
  llamar a `authClient`.
- Si todo es válido → llama a `authClient.signUp.email({ email, password, name })`.
  - Si resuelve con éxito → navega a `/` (usando `useNavigate` de React
    Router).
  - Si rechaza/devuelve error → muestra el mensaje de error devuelto por
    Better Auth (p.ej. "El email ya está registrado") sin navegar.

En los tests de este step, `authClient` se mockea en su límite exacto
(el método `signUp.email`, que es la llamada de red real a
`apps/server`) — no se levanta el server real aquí (eso ya está probado
de extremo a extremo en los steps 18-19 y se verifica manualmente en
`criterios-aceptacion.md` AC5). Mockear en este punto es el nivel
correcto según la skill `tdd`: la llamada de red es la dependencia
lenta/externa; la lógica de validación y navegación del formulario es
la que este step debe probar de verdad.

## Criterios de aceptación

- [ ] El formulario tiene campos nombre, email, password, confirmar
      password, y checkbox de aceptación con enlaces a `/privacy` y
      `/terms`.
- [ ] Passwords que no coinciden bloquean el envío con un error visible.
- [ ] Checkbox sin marcar bloquea el envío con un error visible.
- [ ] Envío válido llama a `authClient.signUp.email` con los datos del
      formulario.
- [ ] Éxito navega fuera de `/register`.
- [ ] Error de Better Auth se muestra en el formulario sin navegar.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/pages/RegisterPage.test.tsx`
- `vi.mock('../lib/auth-client', () => ({ authClient: { signUp: { email: vi.fn() } } }))`
  (o el shape exacto que exponga `apps/panel/src/lib/auth-client.ts` del
  step 21) al inicio del fichero.
- `describe('RegisterPage')`:
  - `it('muestra enlaces a privacidad y términos junto al checkbox')` —
    `screen.getByRole('link', { name: /privacidad/i })` con
    `href="/privacy"` y `screen.getByRole('link', { name: /términos/i })`
    con `href="/terms"`. Falla porque `RegisterPage` es aún el
    placeholder del step 04 (sin formulario).
  - `it('bloquea el envío si las passwords no coinciden')` —
    con `userEvent`, rellena password y confirmar password distintos,
    marca el checkbox, pulsa "Crear cuenta"; comprueba
    `screen.getByText(/las contraseñas no coinciden/i)` visible y que
    `authClient.signUp.email` (el mock) no se llamó
    (`expect(mockedSignUpEmail).not.toHaveBeenCalled()`).
  - `it('bloquea el envío si no se acepta el checkbox')` — rellena todo
    correctamente pero no marca el checkbox; error visible, mock no
    llamado.
  - `it('llama a signUp.email con los datos del formulario al enviar válido')` —
    rellena todo correctamente, marca el checkbox, envía; el mock se
    llamó con `{ email, password, name }` iguales a los introducidos
    (comprobación de argumentos exacta, no solo "fue llamado" — la
    skill `tdd` exige dobles específicos cuando los argumentos son
    parte del contrato).
  - `it('navega fuera de /register cuando el registro tiene éxito')` —
    el mock resuelve con éxito (`mockResolvedValueOnce({ data: {...}, error: null })`
    o el shape real que devuelva Better Auth, a confirmar contra la
    librería real); tras el submit, el componente de destino (renderizado
    dentro de un `MemoryRouter` con ruta `/` mockeada con un marcador de
    texto) es visible, o se usa un spy sobre `useNavigate` comprobando
    que se llamó con `'/'`.
  - `it('muestra el error de Better Auth sin navegar cuando el registro falla')` —
    el mock resuelve con
    `{ data: null, error: { message: 'El email ya está registrado' } }`
    (shape real de Better Auth a confirmar); tras el submit,
    `screen.getByText(/el email ya está registrado/i)` visible y no hay
    navegación.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/pages/RegisterPage.tsx` — formulario completo con
  estado local, validación, llamada a `authClient.signUp.email`,
  manejo de éxito/error, `<Seo />`.
- `apps/panel/src/pages/RegisterPage.module.scss` — nuevo.
- `apps/panel/src/pages/RegisterPage.test.tsx` — nuevo, tests descritos
  arriba.

## Skills necesarias

- tdd — ciclo rojo/verde del formulario, con especial atención a
  mockear solo en el límite de red (`authClient.signUp.email`), nunca
  la lógica de validación propia.

## Commits de este step

test: Añadir tests en rojo del formulario de registro
feat: Implementar el formulario de registro contra Better Auth

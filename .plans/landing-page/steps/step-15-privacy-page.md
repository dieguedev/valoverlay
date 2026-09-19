# Step 15: Página `/privacy` con contenido legal borrador

## Tarea

`PrivacyPage` (placeholder desde el step 04) pasa a tener contenido
legal borrador real (acuerdo punto 10, no reabrir): qué datos se
recogen, para qué se usan y el derecho de borrado. Copy propuesto (el
usuario lo revisará con criterio legal antes de publicar — este step
entrega un borrador funcional, no un texto validado legalmente):

- Heading: **"Política de privacidad"**.
- Sección **"Qué datos recogemos"**: email, contraseña (almacenada
  hasheada, nunca en texto plano), y, cuando el usuario vincule su
  cuenta de Riot desde su perfil, los datos de partida que Riot Games
  autoriza compartir mediante su API oficial.
- Sección **"Para qué los usamos"**: autenticarte, mostrar tus
  estadísticas de Valorant en el overlay que tú configures, y mantener
  tu sesión activa.
- Sección **"Tu derecho a borrar tus datos"**: puedes solicitar el
  borrado de tu cuenta y de todos tus datos asociados en cualquier
  momento.

También añade `<Seo />` (componente del step 05) con título/descripción
propios de esta página.

## Criterios de aceptación

- [ ] `/privacy` muestra un heading `<h1>` "Política de privacidad".
- [ ] Contiene una sección sobre qué datos se recogen que menciona
      email, contraseña y datos de Riot.
- [ ] Contiene una sección sobre el derecho de borrado.
- [ ] Fija su propio `document.title`/meta description vía `Seo`.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/pages/PrivacyPage.test.tsx`
- `describe('PrivacyPage')`:
  - `it('renderiza el heading de política de privacidad')` —
    `screen.getByRole('heading', { level: 1, name: /privacidad/i })`.
    Ya pasaría con el placeholder del step 04 si el heading coincide en
    texto — para que este test sea un rojo real, comprueba además
    contenido que el placeholder no tiene (ver siguiente `it`), de forma
    que el conjunto del step falle antes de implementar.
  - `it('explica qué datos se recogen')` —
    `screen.getByText(/contraseña/i)` y `screen.getByText(/riot/i)`
    presentes. Falla con el placeholder actual (sin contenido).
  - `it('explica el derecho de borrado')` —
    `screen.getByText(/borrado|eliminar tus datos/i)` presente.
  - `it('fija su propio title del documento')` —
    `document.title` contiene `/privacidad/i` tras renderizar.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/pages/PrivacyPage.tsx` — contenido legal completo +
  `<Seo />`.
- `apps/panel/src/pages/PrivacyPage.module.scss` — nuevo (o reutiliza un
  estilo compartido de página legal si quien implementa lo considera
  razonable, decisión libre no fijada en el acuerdo).
- `apps/panel/src/pages/PrivacyPage.test.tsx` — nuevo, tests descritos
  arriba.

## Skills necesarias

- tdd — ciclo rojo/verde del contenido.

## Commits de este step

test: Añadir tests en rojo del contenido de PrivacyPage
feat: Añadir contenido legal a PrivacyPage

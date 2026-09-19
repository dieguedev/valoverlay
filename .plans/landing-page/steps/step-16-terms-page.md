# Step 16: Página `/terms` con contenido legal borrador

## Tarea

`TermsPage` (placeholder desde el step 04) pasa a tener contenido legal
borrador real (acuerdo punto 10, no reabrir): condiciones de uso básicas
del servicio. Copy propuesto (borrador, no validado legalmente):

- Heading: **"Términos y condiciones"**.
- Sección **"Uso del servicio"**: ValoVerlay es un servicio para mostrar
  tus propias estadísticas de Valorant en un overlay de streaming; el
  uso está sujeto a las políticas de la API de Riot Games.
- Sección **"Tu cuenta"**: eres responsable de mantener tus credenciales
  seguras; puedes cerrar tu cuenta cuando quieras.
- Sección **"Datos de terceros"**: no se muestran datos de otros
  jugadores sin su consentimiento explícito.

También añade `<Seo />` con título/descripción propios.

## Criterios de aceptación

- [ ] `/terms` muestra un heading `<h1>` "Términos y condiciones".
- [ ] Contiene una sección sobre el uso del servicio que menciona
      Valorant y streaming/overlay.
- [ ] Contiene una sección que aclara que no se muestran datos de otros
      jugadores sin consentimiento.
- [ ] Fija su propio `document.title`/meta description vía `Seo`.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/pages/TermsPage.test.tsx`
- `describe('TermsPage')`:
  - `it('renderiza el heading de términos y condiciones')` —
    `screen.getByRole('heading', { level: 1, name: /términos/i })`.
  - `it('explica el uso del servicio')` —
    `screen.getByText(/valorant/i)` y texto relacionado con
    overlay/streaming presentes. Falla con el placeholder actual (sin
    contenido).
  - `it('aclara que no se muestran datos de otros jugadores sin consentimiento')` —
    `screen.getByText(/consentimiento/i)` presente.
  - `it('fija su propio title del documento')` —
    `document.title` contiene `/términos/i` tras renderizar.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/pages/TermsPage.tsx` — contenido legal completo +
  `<Seo />`.
- `apps/panel/src/pages/TermsPage.module.scss` — nuevo (o compartido con
  `PrivacyPage`, decisión libre).
- `apps/panel/src/pages/TermsPage.test.tsx` — nuevo, tests descritos
  arriba.

## Skills necesarias

- tdd — ciclo rojo/verde del contenido.

## Commits de este step

test: Añadir tests en rojo del contenido de TermsPage
feat: Añadir contenido legal a TermsPage

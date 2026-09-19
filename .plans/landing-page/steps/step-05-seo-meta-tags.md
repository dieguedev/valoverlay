# Step 05: Meta tags SEO/Open Graph base + componente `Seo` reutilizable

## Tarea

Dos partes:

1. **Meta tags estáticos en `apps/panel/index.html`**: sustituir el HTML
   de scaffold (`<html lang="en">`, `<title>panel</title>`, sin meta
   description ni Open Graph) por la versión de producto: `lang="es"`,
   `<title>` con el nombre del producto, `<meta name="description">`,
   `<meta property="og:title">`, `<meta property="og:description">`,
   `<meta property="og:image">` (usar una ruta de imagen placeholder en
   `apps/panel/public/`, p.ej. `/og-image.png`, aunque el asset real no
   exista todavía como fichero binario — dejar la referencia y anotar
   que el asset final lo aporta quien ejecute este step o un step de
   diseño posterior; no bloquea la funcionalidad).
2. **Componente `Seo` reutilizable**
   (`apps/panel/src/components/Seo/Seo.tsx`) para que cada página pueda
   sobreescribir `title` y `description` por ruta usando las etiquetas
   nativas de React 19 (`<title>`, `<meta>` renderizadas directamente en
   el árbol de componentes, que React 19 elonga automáticamente a
   `<head>` sin necesitar `react-helmet` ni ninguna librería adicional).

## Criterios de aceptación

- [ ] El HTML servido en `/` tiene `<html lang="es">`, `<title>` con el
      nombre del producto y las 4 meta tags (description, og:title,
      og:description, og:image) con contenido no vacío.
- [ ] `HomePage` usa `<Seo title="..." description="..." />` para fijar
      su propio título/descripción (distinto del de `/login`, `/privacy`,
      etc. cuando esos steps lo adopten).
- [ ] No se instala ninguna dependencia nueva para esto (se usa el
      soporte nativo de metadatos de documento de React 19).

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/components/Seo/Seo.test.tsx`
- `describe('Seo')`:
  - `it('escribe el title del documento')` — antes de implementar,
    `Seo` no existe, el import falla; una vez existe el componente pero
    antes de que use `<title>`, el test falla porque
    `document.title` no cambia al valor pasado por props.
  - `it('escribe la meta description del documento')` — comprueba
    `document.querySelector('meta[name="description"]')?.getAttribute('content')`
    igual al valor pasado por props; falla mientras el componente no
    renderice esa etiqueta.
- Test de integración en `apps/panel/src/App.test.tsx` (añadir un
  `it` a los ya existentes del step 04):
  - `it('la home page fija su propio title')` — renderiza `<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>`
    y comprueba `document.title` igual al título específico de home.
    Falla mientras `HomePage` no use `Seo`.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/index.html` — `lang="es"`, `<title>` de producto, 4 meta
  tags nuevas.
- `apps/panel/public/og-image.png` — referencia añadida en `index.html`;
  si el asset binario no se aporta en este step, dejarlo documentado como
  pendiente sin romper el build (la etiqueta `<meta>` no requiere que el
  fichero exista para compilar).
- `apps/panel/src/components/Seo/Seo.tsx` — nuevo, props
  `{ title: string; description: string }`, renderiza `<title>{title}</title>`
  y `<meta name="description" content={description} />`.
- `apps/panel/src/components/Seo/Seo.test.tsx` — nuevo, tests descritos
  arriba.
- `apps/panel/src/pages/HomePage.tsx` — usa `<Seo />` con título/
  descripción de producto.
- `apps/panel/src/App.test.tsx` — añadir el test de integración descrito
  arriba.

## Skills necesarias

- tdd — ciclo rojo/verde del componente `Seo`.

## Commits de este step

test: Añadir tests en rojo del componente Seo
feat: Añadir meta tags SEO/Open Graph y componente Seo reutilizable

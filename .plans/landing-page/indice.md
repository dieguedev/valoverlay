# Plan: landing-page — Landing page pública de ValoVerlay

Rama: main
Fecha: 2026-09-17

## Baby-steps a seguir

- [x] [step-01-vitest-rtl-panel.md](steps/step-01-vitest-rtl-panel.md) — Instalar y configurar Vitest + RTL + jsdom en apps/panel, verificado con un test de humo
- [x] [step-02-vitest-supertest-server.md](steps/step-02-vitest-supertest-server.md) — Instalar Vitest + supertest en apps/server, extrayendo un `app.ts` testable sin efectos secundarios
- [x] [step-03-sass-design-tokens.md](steps/step-03-sass-design-tokens.md) — Instalar SASS y definir los tokens de diseño (color, tipografía, espaciado) de la marca
- [x] [step-04-react-router-public-layout.md](steps/step-04-react-router-public-layout.md) — Instalar React Router y definir las 5 rutas públicas con páginas placeholder
- [x] [step-05-seo-meta-tags.md](steps/step-05-seo-meta-tags.md) — Meta tags SEO/Open Graph base en index.html + componente `Seo` reutilizable por ruta
- [x] [step-06-header-component.md](steps/step-06-header-component.md) — Componente `Header` (logo + navegación + CTAs a login/register)
- [x] [step-07-footer-component.md](steps/step-07-footer-component.md) — Componente `Footer` (enlaces legales + copyright)
- [x] [step-08-public-layout-header-footer.md](steps/step-08-public-layout-header-footer.md) — Integrar `Header` y `Footer` en `PublicLayout`
- [ ] [step-09-hero-section.md](steps/step-09-hero-section.md) — Sección Hero con copy real y CTA a /register
- [ ] [step-10-features-section.md](steps/step-10-features-section.md) — Sección Features con copy real de las tres piezas del producto
- [ ] [step-11-como-funciona-section.md](steps/step-11-como-funciona-section.md) — Sección "Cómo funciona" con los pasos del flujo de usuario
- [ ] [step-12-pricing-section.md](steps/step-12-pricing-section.md) — Sección Pricing (Free/Pro) con los 3 diferenciadores del plan Pro
- [ ] [step-13-faq-section.md](steps/step-13-faq-section.md) — Sección FAQ interactiva (acordeón)
- [ ] [step-14-home-page-composicion.md](steps/step-14-home-page-composicion.md) — Componer la HomePage con todas las secciones en la ruta `/`
- [ ] [step-15-privacy-page.md](steps/step-15-privacy-page.md) — Página `/privacy` con contenido legal borrador
- [ ] [step-16-terms-page.md](steps/step-16-terms-page.md) — Página `/terms` con contenido legal borrador
- [ ] [step-17-better-auth-schema-drizzle.md](steps/step-17-better-auth-schema-drizzle.md) — Instalar Better Auth + adapter Drizzle, generar y migrar el schema de auth
- [ ] [step-18-better-auth-mount-signup.md](steps/step-18-better-auth-mount-signup.md) — Montar el handler de Better Auth en Express y probar el registro real (sign-up)
- [ ] [step-19-better-auth-signin.md](steps/step-19-better-auth-signin.md) — Probar el login real (sign-in) contra Better Auth
- [ ] [step-20-better-auth-google-oauth.md](steps/step-20-better-auth-google-oauth.md) — Configurar el proveedor Google OAuth en Better Auth
- [ ] [step-21-better-auth-client-panel.md](steps/step-21-better-auth-client-panel.md) — Instalar y configurar el cliente de Better Auth en apps/panel
- [ ] [step-22-register-page.md](steps/step-22-register-page.md) — Página `/register` funcional contra Better Auth
- [ ] [step-23-login-page.md](steps/step-23-login-page.md) — Página `/login` funcional contra Better Auth (email/password + Google)
- [ ] [step-24-guest-only-guard.md](steps/step-24-guest-only-guard.md) — Guard "solo invitados" que redirige `/login` y `/register` si ya hay sesión

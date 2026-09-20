---
name: design
description: Usar antes de tomar cualquier decisión de diseño para no repetir ni contradecir lo ya decidido, y actualizar cuando aparezca un rol o un criterio nuevo.
---

No es una copia de `_tokens.scss`. Esos valores concretos viven en el código y cambian con más frecuencia que el sistema. Esto documenta los roles (para qué sirve cada uno) y el criterio para extenderlos sin romper la coherencia.

SIEMPRE actualiza esta skill cuando cambie un criterio o aparezca un rol nuevo, no cuando cambie un hex o un nombre de fuente suelto.
NUNCA AÑADAS comentarios en el código acerca de diseño, esta es la fuente de la verdad.

## Color

Dos capas de fondo (base + elevado) para que los paneles se distingan por valor, no solo por borde, nunca negro puro.

### Superficie

- Reservado para tarjetas, paneles, controles, un nivel por encima del fondo.

### Acento primario

- Reservado para elementos interactivos "en vivo" (foco, selección, datos en tiempo real).
- NO USAR para texto largo ni decoración plana.

### Acento cálido

- Reservado para alertas y estados de contraste (avisos, kill-feed)
- NO USAR como acento general aunque combine bien.

### Texto

Hay 3 tipos distintos:

- Principal
- Muted (secundario/deshabilitado)
- Inverso
  - Usar sobre fondos claros o de acento.

### Bordes

Hay 2 tipos distintos:

- Default
- Strong
  - Usar para más énfasis: focus, error.

## Tipografía

- **Heading**: Familia Serif
  - Usar solo para headings/display.
  - NO USAR en UI densa o controles.
- **Body**: Familia Sans Serif
  - Usar para todo el contenido de control/UI.

Todas las fuentes se alojan localmente en `apps/panel/src/assets/fonts/` como variable font.
NUNCA se añaden desde un CDN o un servidor externo.

- Escala: Utiliza una proporción de x1.25 del anterior sobre una base de 16px.
- Tiene 3 pesos: Regular, medium y bold. NO AÑADIR un peso intermedio sin consentimiento del usuario.

## Espaciado

- Escala: Todo espaciado es múltiplo de 4px sobre una base de 4px. NO AÑADIR un espaciado distinto sin consentimiento el usuario y sin respetar esta escala, aunque el usuario mencione un valor que no la respete.

---
name: crear-tickets
description: Descompone un plan de baby-steps de `planificar` (o, como fallback, la conversación actual) en un conjunto de tickets tracer-bullet, cada uno con sus blocking edges, publicados como issues hijos livianos de wayfinder en el tracker configurado.
disable-model-invocation: true
---

# Crear Tickets

Descompone un plan de `planificar` (o una spec/conversación) en un conjunto de **tickets**: cortes verticales tracer-bullet, cada uno declarando los tickets que lo **bloquean**.

El tracker de issues y el vocabulario de labels de triage deberían haberte sido provistos ya. Si no, dile al usuario que corra `/setup-matt-pocock-skills`.

## Proceso

### 1. Reunir contexto

Si el usuario pasa un issue mapa (un issue `wayfinder:map` publicado por `/planificar`) como argumento, léelo y lee `.plans/<feature-slug>/indice.md` y `steps/*.md` del repo — ese plan es tu input, no la conversación en crudo. En caso contrario, trabaja con lo que ya haya en el contexto de la conversación, o busca la spec/issue de referencia que haya pasado el usuario.

### 2. Explorar el codebase (opcional)

Si el input es un plan de `planificar`, su `investigacion.md` ya cubre el codebase — sáltate más exploración salvo que falte algo. En caso contrario, si todavía no exploraste el código, hazlo para entender el estado actual. Los títulos y descripciones de los tickets deben usar el vocabulario del glosario de dominio del proyecto, y respetar las ADRs del área que toques.

Busca oportunidades de prefactorizar el código para que la implementación sea más fácil. "Haz el cambio fácil, luego haz el cambio fácil."

### 3. Diseñar los cortes verticales

**Cuando el input es un plan de `planificar`**: no cortes verticales desde cero. En vez de eso, **agrupa los baby-steps ya existentes del plan en paquetes del tamaño de un ticket** — los baby-steps en sí (su seam, tests, criterio de verde) ya están decididos y cerrados; agruparlos es una decisión narrativa/de tamaño de demo, no una re-derivación del trabajo. Cada paquete sigue teniendo que ser demoable o verificable por separado, aplicando la regla al paquete completo en vez de a cada baby-step suelto.

**En caso contrario** (spec o conversación sin un plan de `planificar` detrás), corta el trabajo en tickets **tracer bullet** desde cero.

<vertical-slice-rules>

- Cada corte atraviesa un camino angosto pero COMPLETO por todas las capas (schema, API, UI, tests): vertical, NO un corte horizontal de una sola capa
- Un corte completado es demoable o verificable por sí solo
- Cada corte tiene el tamaño justo para caber en una ventana de contexto fresca
- Cualquier prefactorización debe hacerse antes

</vertical-slice-rules>

Dale a cada ticket sus **blocking edges**: los otros tickets que deben completarse antes de que pueda arrancar. Un ticket sin blockers puede arrancar inmediatamente.

**Los refactors amplios son la excepción al corte vertical.** Un **refactor amplio** es un cambio mecánico único (renombrar una columna, retipar un símbolo compartido) cuyo **radio de impacto** se extiende por todo el codebase, de forma que una sola edición rompe miles de call sites a la vez y ningún corte vertical puede quedar en verde. No lo fuerces a ser un tracer bullet; secuéncialo como **expand-contract**. Primero expand: agrega la nueva forma junto a la vieja sin romper nada. Luego migra los call sites en lotes dimensionados por radio de impacto (por paquete, por directorio), cada lote su propio ticket bloqueado por el expand, manteniendo el CI en verde lote a lote porque la forma vieja todavía existe. Por último contract: borra la forma vieja una vez que no queda ningún caller, en un ticket bloqueado por todos los lotes de migración. Cuando ni los lotes puedan quedar en verde por sí solos, mantén la secuencia pero deja que compartan una rama de integración que todos bloqueen a un ticket final de integrar-y-verificar; el verde solo se promete ahí.

### 4. Interrogar al usuario

Presenta el desglose propuesto como una lista numerada. Para cada ticket, muestra:

- **Título**: nombre corto y descriptivo
- **Bloqueado por**: qué otros tickets (si los hay) deben completarse antes
- **Qué entrega**: el comportamiento end-to-end que este ticket hace funcionar

Pregúntale al usuario:

- ¿La granularidad se siente correcta? (demasiado gruesa / demasiado fina)
- ¿Los blocking edges son correctos: cada ticket depende solo de los tickets que genuinamente lo condicionan?
- ¿Hay que fusionar o dividir más algún ticket?

Itera hasta que el usuario apruebe el desglose.

### 5. Publicar los tickets en el tracker configurado

Publica los tickets aprobados como **issues hijos de wayfinder** del mapa (convenciones en `docs/agents/issue-tracker.md`), en orden de dependencia (blockers primero) para que los blocking edges de cada ticket puedan referenciar identificadores reales.

Cada issue hijo es **liviano** — NO repite el contrato completo de los baby-steps que agrupa (eso puede sumar varios cientos de líneas entre varios steps). Solo apunta a lo que ya está commiteado en `.plans/<feature-slug>/steps/`:

- Un checklist con los títulos de los baby-steps que agrupa este ticket (no su contrato completo).
- Criterios de aceptación del paquete completo.
- Un puntero a `.plans/<feature-slug>/steps/` con el contrato completo de cada baby-step (tarea, tests en rojo, criterio de verde, ficheros afectados, commits propuestos).
- Blocking edges nativos hacia los tickets que lo condicionan (`docs/agents/issue-tracker.md` → Blocking), el mismo mecanismo ya usado entre tickets hermanos.
- Labels: `ready-for-agent` (agent-grabbable por construcción) **+** `wayfinder:task` (compatible con la convención de wayfinder — ambos labels conviven sin conflicto).

Si esta ejecución no tiene un plan de `planificar` detrás (input de spec/conversación), publica los tickets de la misma forma pero sin puntero a `.plans/` — usa el cuerpo completo del ticket en línea, según la plantilla de abajo.

Trabaja la **frontera**: cualquier ticket cuyos blockers estén todos completados. Para una cadena puramente lineal eso significa de arriba a abajo.

NO cierres ni modifiques el issue mapa.

<wayfinder-child-template>

Part of #<número-del-issue-mapa>

## Qué entrega

El comportamiento end-to-end que este ticket hace funcionar, desde la perspectiva del usuario, no una lista de implementación capa por capa.

## Baby-steps que agrupa

- [ ] [step-NN-nombre] — descripción en una línea
- [ ] [step-NN-nombre] — descripción en una línea

Contrato completo de cada step (seam, tests en rojo, criterio de verde, ficheros afectados, commits propuestos): `.plans/<feature-slug>/steps/`

## Criterios de aceptación

- [ ] Criterio 1
- [ ] Criterio 2

## Blocked by

- Referencia a cada ticket que lo bloquea, o "None (can start immediately)".

</wayfinder-child-template>

<standalone-issue-template>

## Parent

Referencia al issue padre en el tracker (si la fuente era un issue ya existente; en caso contrario omite esta sección).

## Qué construir

El comportamiento end-to-end que este ticket hace funcionar, desde la perspectiva del usuario, no una implementación capa por capa.

## Criterios de aceptación

- [ ] Criterio 1
- [ ] Criterio 2

## Blocked by

- Referencia a cada ticket que lo bloquea, o "None (can start immediately)".

</standalone-issue-template>

En cualquiera de las dos formas, evita rutas de fichero o snippets de código más allá del puntero a `.plans/`: quedan desactualizados rápido. Excepción: si un prototipo produjo un snippet que codifica una decisión con más precisión de la que puede dar la prosa (máquina de estados, reducer, schema, forma de un tipo), inclúyelo y anota brevemente que viene de un prototipo. Recorta a las partes ricas en decisiones, no una demo funcional, solo lo importante.

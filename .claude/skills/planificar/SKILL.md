---
name: planificar
description: Planifica una feature completa en baby-steps con TDD, partiendo de la conversación o del pedido del usuario (no de un ticket ya existente). Hace un interrogatorio con el usuario, lanza un subagente investigador del codebase, genera el plan completo y lo publica como issue mapa en GitHub para continuar con /crear-tickets.
disable-model-invocation: true
---

# Planificar

## FASE 0: Contexto dinámico

### 0.1 — Detectar proyecto, rama y config

Ejecuta:

```bash
git branch --show-current

PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$PROJECT_ROOT" ]; then
  echo "No estás dentro de un repositorio git. No se puede localizar el proyecto."
  exit 1
fi

SKILL_DIR="$PROJECT_ROOT/.claude/skills/planificar"
CONFIG="$SKILL_DIR/references/config.json"
PROJECT_NAME=$(python3 -c "import json;print(json.load(open('$CONFIG'))['project_name'])")
TICKET_TRACKER_TYPE=$(python3 -c "import json;print(json.load(open('$CONFIG'))['ticket_tracker']['type'])")
ASK_FEATURE_FLAG=$(python3 -c "import json;print(json.load(open('$CONFIG'))['ask_feature_flag'])")

echo "Raiz del proyecto: $PROJECT_ROOT"
echo "Nombre del proyecto: $PROJECT_NAME"
echo "Ticket tracker: $TICKET_TRACKER_TYPE"
```

- Si `TICKET_TRACKER_TYPE` no es `none`, lee `$PROJECT_ROOT/docs/agents/issue-tracker.md` y sigue sus convenciones para cualquier operación contra el tracker (crear issues, labels, wayfinding), en vez de improvisar lógica propia de `gh`. Si el fichero no existe, dile al usuario que corra `/setup-matt-pocock-skills` antes de continuar.
- `planificar` es el punto de entrada del pipeline: parte siempre de la conversación o del pedido del usuario, nunca de un ticket ya existente (el ticket — el issue mapa — es el resultado de esta skill, no su input). Por eso no hace falta extraer ningún ID de la rama actual.
- Pide al usuario un identificador corto en kebab-case para la feature (p. ej. `login-fix`) y úsalo como `FEATURE_SLUG`. Se usa para nombrar la carpeta de output y, más adelante, el issue mapa.
- La config de esta skill vive en [references/config.json](references/config.json).

### 0.2 — Decidir dónde guardar el output

**Si el usuario tiene el MCP de Obsidian activo:**

- **SIEMPRE** preguntarle en qué bóveda quiere guardar.

**Si NO tiene el MCP:**

- Comentárselo primero, por si quiere activarlo.
- Si el usuario no quiere Obsidian, guardar de forma local, commiteada al repo (no en `/tmp`, que es efímero):

```bash
OUTPUT_DIR="$PROJECT_ROOT/.plans/${FEATURE_SLUG}"
mkdir -p "$OUTPUT_DIR/steps"
echo "Output dir: $OUTPUT_DIR"
```

### 0.3 — Estructura de carpetas del output (fija)

```
.plans/
└── FEATURE_SLUG (p.ej. login-fix/)
    ├── steps/
    │   ├── step-01-descripcion-en-kebab-case
    │   ├── step-02-descripcion-en-kebab-case
    │   └── ...
    ├── investigacion   ← hechos objetivos del codebase
    ├── indice          ← índice del plan con referencias a los archivos
    ├── criterios-aceptacion  ← ACs + verificación (setup/mocks/asserts)
    └── resumen
```

La estructura es fija; cualquier contenido debe estar en esos ficheros.

---

## FASE 1: Obtener contexto de la tarea

`planificar` reemplaza a `to-spec` como punto de entrada del pipeline: parte siempre de la conversación o del pedido directo del usuario, nunca de un ticket ya existente, independientemente de `TICKET_TRACKER_TYPE`.

### 1.1 — Reunir el contexto

Si ya hay contexto suficiente en la conversación actual, parte de él y pide solo lo que falte. Si no, pregunta directamente:

```
"¿Qué hay que hacer? Dame un resumen de la tarea (objetivo, alcance y, si los tienes claros, criterios de aceptación)."
```

### 1.2 — Presentar resumen al usuario

```
Feature: [FEATURE_SLUG]

Tenemos que: [Resumen en 2-3 frases, a partir de lo que ha dicho el usuario o de la conversación]

¿Es correcto?
```

---

## FASE 2: Investigación y plan

> **Principio clave**: primero se investiga el codebase **sin sesgo alguno de lo que opine el usuario**, y solo después se combina esa investigación con el acuerdo del interrogatorio para generar el plan.

### FASE 2a — Generar preguntas de investigación

Antes de lanzar cualquier agente, genera una lista de preguntas objetivas sobre el codebase **a partir solo del contexto de la tarea** (el resumen de FASE 1).

Ejemplos de forma:

```
- ¿Cómo está implementado actualmente [componente/vista relacionada]?
- ¿Qué patrón siguen las llamadas HTTP / servicios en [módulo similar]?
- ¿Qué tests existen ya para [área afectada]? ¿Mocks?
- ¿Hay algún servicio, hook o componente que ya resuelva un caso parecido a [X]?
- ¿Qué interfaces/tipos existen ya para [entidad relacionada]?
```

### FASE 2b — Investigación objetiva (subagente explorador)

Lanza un **subagente explorador** usando el prompt de [references/agente-explorador.md](references/agente-explorador.md), rellenando:

- `[TICKET_ID]` y `[TICKET_TÍTULO]` — `FEATURE_SLUG` y el resumen obtenido en FASE 1
- `[PREGUNTAS_FASE_2A]` — las preguntas generadas en la FASE 2a
- `[CONTEXTO_TICKET]` — el contexto de la tarea completo (resumen freeform de FASE 1)
- `[OUTPUT_DIR]` — el path calculado en FASE 0

### FASE 2c — Sesión de interrogatorio

**REGLA A CUMPLIR**: Puedes usar la investigación previa como contexto para formular preguntas más precisas, pero NO la puedes usar para acotar o sugerir respuestas. Las decisiones de implementación las toma el usuario, no el codebase.

Usa la skill `/grill-me` para interrogar al usuario sobre todo lo que el contexto de la tarea no especifica.

Si `ASK_FEATURE_FLAG` es `true`, al concluir el interrogatorio **SIEMPRE** añade esta pregunta:

```md
> ¿Quieres proteger este desarrollo con feature flag? Si es así, ¿qué nombre le ponemos?
> (Ejemplo: `accesibilidadBoton`, `implementacionLink`)
```

**No avances a FASE 2d** hasta que el usuario confirme EXPLÍCITAMENTE que hemos llegado a un acuerdo.

### FASE 2d — Generación del plan

Calcula el path de la skill `tdd` usando: `$PROJECT_ROOT/.claude/skills/tdd/SKILL.md` (`PROJECT_ROOT` ya calculado en FASE 0.1).

Lanza un **subagente planificador** usando el prompt de [references/agente-planificador.md](references/agente-planificador.md), rellenando:

- `[TICKET_ID]` y `[TICKET_TÍTULO]` — `FEATURE_SLUG` y el resumen obtenido en FASE 1
- `[OUTPUT_DIR]` — el path calculado en FASE 0

Y adjuntándole:

1. El contexto completo de la tarea (resumen freeform de FASE 1, con criterios de aceptación si existen)
2. El fichero `investigacion.md` generado en FASE 2b
3. El acuerdo de la sesión de interrogatorio
4. El path de la skill `tdd`

---

## FASE 3: Aprobación del plan

### 3.1 — Presentar el plan al usuario

Lee `$OUTPUT_DIR/indice.md` y usa este formato:

```md
Plan generado para [FEATURE_SLUG].

Baby-steps:

1. [descripción step 1]
2. [descripción step 2]
   ...

Ficheros en: [OUTPUT_DIR]

¿Apruebas el plan? :D
Puedes leer el plan más en detalle en `$OUTPUT_DIR`
```

### 3.2 — Iterar si hay ajustes

- Si el usuario pide ajustes, edita `indice.md` **y** los step files afectados a la vez.

### 3.3 — Cierre

Cuando el usuario apruebe el plan (solo aplica si el output es local — si vive en Obsidian, omite los pasos de commit/publicación y avisa al usuario de que tendrá que compartir la ruta de Obsidian a mano con `/crear-tickets`):

1. **Commitear el plan al repo**:

```bash
git add "$OUTPUT_DIR"
git commit -m "chore: plan de $FEATURE_SLUG"
```

En la rama actual, o en `main` si todavía no existe una rama de feature dedicada.

2. **Publicar el issue mapa en GitHub** — label `wayfinder:map` (convención documentada en `docs/agents/issue-tracker.md`), con el mismo template de spec que usaba `to-spec`:

<spec-template>

## Descripción del problema

El problema que enfrenta el usuario, desde su perspectiva.

## Solución

La solución al problema, desde la perspectiva del usuario.

## Historias de usuario

Una lista numerada y extensa de user stories, formato:

1. COMO <actor>, QUIERO <feature>, PARA <benefit>

## Decisiones de implementación

Decisiones de implementación tomadas durante el interrogatorio (módulos, interfaces, decisiones arquitectónicas, contratos). Sin rutas de fichero ni snippets de código — quedan desactualizados rápido.

## Decisiones de testing

Decisiones de testing tomadas: qué se prueba, con qué criterio, prior art del codebase.

## Fuera del scope

Qué queda fuera de esta feature.

## Notas adicionales

Puntero al plan commiteado: `$OUTPUT_DIR/indice.md` (o la ruta de Obsidian, si aplica).

</spec-template>

Publícalo con `gh issue create --title "[FEATURE_SLUG]" --label "wayfinder:map" --body "..."` (heredoc para el body).

3. Escribe al usuario:

```md
Ya hemos llegado a un acuerdo, creado un plan y publicado el issue mapa #[N]! :)

Lo siguiente que tienes que hacer es correr `/crear-tickets` sobre el issue #[N].
```

---

## Reglas

- **EL ORDEN ES CRÍTICO**: Tienes que seguir la skill paso a paso, sin adelantarte.
- NO escribas código en esta sesión. Para eso está `ejecutar`.
- NO lances la ejecución desde aquí. La ejecución es en otro chat.
- NO avances sin acuerdo explícito del usuario al final de la sesión de interrogatorio.
- NO partas de un ticket ya existente: esta skill siempre arranca de la conversación/pedido del usuario, incluso con `TICKET_TRACKER_TYPE` en `github`.
- Si el usuario tiene el MCP de Obsidian activo, pregunta SIEMPRE la bóveda antes de guardar.
- Para adaptar este skill a otro proyecto, edita únicamente [references/config.json](references/config.json) — no toques la lógica de las fases.

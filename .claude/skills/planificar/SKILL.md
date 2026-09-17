---
name: planificar
description: Planifica una tarea en baby-steps con TDD: obtiene el contexto de la tarea (ticket de GitHub o descripción directa del usuario), hace un interrogatorio con el usuario, lanza un subagente investigador del codebase y genera un plan listo para ejecutar con /ejecutar.
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

- Extrae el ID del ticket del nombre de rama.
- Las ramas siguen el patrón `tipo/NNNNN-descripcion` o `NNNNN/descripcion` (NNNNN es el ID del ticket).
- Si no hay ID numérico:
  - Y `TICKET_TRACKER_TYPE` no es `none`, **pide el ID al usuario antes de continuar**.
  - Y `TICKET_TRACKER_TYPE` es `none`, pide un identificador corto en kebab-case para nombrar la carpeta de output (p. ej. `login-fix`) y úsalo como `TASK_ID`.
- La config de esta skill vive en [references/config.json](references/config.json).

### 0.2 — Decidir dónde guardar el output

**Si el usuario tiene el MCP de Obsidian activo:**

- **SIEMPRE** preguntarle en qué bóveda quiere guardar.

**Si NO tiene el MCP:**

- Comentárselo primero, por si quiere activarlo.
- Si el usuario no quiere Obsidian, guardar de forma local:

```bash
TASK_ID=[id extraído o pedido]
OUTPUT_DIR="/tmp/${PROJECT_NAME}-tasks/$TASK_ID"
mkdir -p "$OUTPUT_DIR/steps"
echo "Output dir: $OUTPUT_DIR"
```

### 0.3 — Estructura de carpetas del output (fija)

```
$PROJECT_NAME/
└── TASK_ID (p.ej. login-fix/)
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

### 1.1 — Según `TICKET_TRACKER_TYPE`

**`none`:**

- No hay tracker. Pregunta directamente al usuario:

```
"¿Qué hay que hacer? Dame un resumen de la tarea (objetivo, alcance y, si los tienes claros, criterios de aceptación)."
```

- No hay work item ni Figma que buscar. El contexto de la tarea es lo que responda el usuario.

**`github`:**

- Usa `gh issue view [ID] --json title,body,labels,url` para obtener el issue con el ID extraído en FASE 0.1.
- Busca enlaces a Figma o diseño en el body.

### 1.2 — Presentar resumen al usuario

**Si `TICKET_TRACKER_TYPE` es `none`:**

```
Tarea: [TASK_ID]

Tenemos que: [Resumen en 2-3 frases, a partir de lo que ha dicho el usuario]

¿Es correcto?
```

**Si `TICKET_TRACKER_TYPE` es `github`:**

```
Ticket #[id] — [título]
Tipo: [type]
Figma: [links o "No se ha encontrado ningun enlace a Figma"]

Criterios de aceptación del ticket:
  - [AC1]
  - [AC2]

Tenemos que: [Resumen en 2-3 frases]

¿Es correcto?
```

---

## FASE 2: Investigación y plan

> **Principio clave**: primero se investiga el codebase **sin sesgo alguno de lo que opine el usuario**, y solo después se combina esa investigación con el acuerdo del interrogatorio para generar el plan.

### FASE 2a — Generar preguntas de investigación

Antes de lanzar cualquier agente, genera una lista de preguntas objetivas sobre el codebase **a partir solo del contexto de la tarea** (el resumen de FASE 1, venga de un ticket o de lo que haya dicho el usuario en freeform).

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

- `[TICKET_ID]` y `[TICKET_TÍTULO]` — `TASK_ID` y el título/resumen obtenidos en FASE 1
- `[PREGUNTAS_FASE_2A]` — las preguntas generadas en la FASE 2a
- `[CONTEXTO_TICKET]` — el contexto de la tarea completo (ticket o resumen freeform)
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

- `[TICKET_ID]` y `[TICKET_TÍTULO]` — `TASK_ID` y el título/resumen obtenidos en FASE 1
- `[OUTPUT_DIR]` — el path calculado en FASE 0

Y adjuntándole:

1. El contexto completo de la tarea (ticket o resumen freeform, con criterios de aceptación si existen)
2. El fichero `investigacion.md` generado en FASE 2b
3. El acuerdo de la sesión de interrogatorio
4. El path de la skill `tdd`

---

## FASE 3: Aprobación del plan

### 3.1 — Presentar el plan al usuario

Lee `$OUTPUT_DIR/indice.md` y usa este formato:

```md
Plan generado para [TASK_ID].

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

Cuando el usuario apruebe el plan, escribe:

```md
Ya hemos llegado a un acuerdo y creado un plan! :)

Lo siguiente que tienes que hacer es abrir un nuevo chat y usar la skill
"/ejecutar" pasándole la ruta del index:

Ruta: `$OUTPUT_DIR/indice.md`
```

> Si OUTPUT_DIR es Obsidian y no lo puedes representar bien, escribe `[Ruta] usando el MCP de Obsidian` en vez de una ruta local que no sirva.

---

## Reglas

- **EL ORDEN ES CRÍTICO**: Tienes que seguir la skill paso a paso, sin adelantarte.
- NO escribas código en esta sesión. Para eso está `ejecutar`.
- NO lances la ejecución desde aquí. La ejecución es en otro chat.
- NO avances sin acuerdo explícito del usuario al final de la sesión de interrogatorio.
- Si `TICKET_TRACKER_TYPE` no es `none` y el ticket NO tiene ID numérico en la rama, pídelo ANTES de continuar.
- Si el usuario tiene el MCP de Obsidian activo, pregunta SIEMPRE la bóveda antes de guardar.
- Para adaptar este skill a otro proyecto, edita únicamente [references/config.json](references/config.json) — no toques la lógica de las fases.

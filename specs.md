## Especificaciones del Proyecto — AI Agents Showcase Icesi

### 1. Propósito y Audiencia
- **Qué es:** Plataforma tipo galería/showcase de agentes IA en desarrollo por equipos estudiantiles.
- **Quién lo presenta:** Coordinador de proyectos → Rectoría.
- **Contexto de uso:** Presentación presencial (pantalla grande), posiblemente también exploración individual posterior.
- **Objetivo clave:** Comunicar avance, variedad y calidad de los proyectos de forma visual e impactante.

### 2. Inspiración de UX — YouTube/PlayStore minimalista
Lo que tomas de esas referencias:
- Tarjetas de proyecto como unidad principal (como apps en PlayStore o videos en YouTube)
- Filtros/categorías en la parte superior
- Grid adaptable
- Vista detalle al hacer clic en una tarjeta
- Búsqueda simple

Lo que simplificas (porque no es una plataforma pública):
- Sin login/auth
- Sin sistema de reseñas o ratings reales
- Sin uploads dinámicos (contenido curado)

### 3. Identidad Visual
| Elemento | Especificación |
|---|---|
| Logo | Logo horizontal Icesi (versión positiva sobre blanco, o negativa sobre azul) |
| Color principal | Azul Icesi `#5454e9` |
| Color secundario | Blanco `#ffffff` |
| Paleta de apoyo | Puedes usar complementarios del manual (amarillo, verde, morado, naranja) para categorizar agentes |
| Tipografía principal | **Plus Jakarta Sans** (la institucional, gratis en Google Fonts) |
| Tipografía fallback | Arial (solo Office/docs, no aplica aquí) |
| Tagline | "Llega más lejos" — solo si el coordinador lo aprueba para este contexto |

> ⚠️ **Nota de uso:** Usa el logo tal como lo provee la universidad, sin modificar proporciones ni colores. Respeta el área de reserva.

### 4. Estructura de Contenido por Agente

Cada tarjeta/ficha de agente debería exponer:

- Imagen o ícono representativo
- Nombre del agente
- Descripción
- Demo link o acceso a video corto (opcional)

### 5. Páginas / Vistas

1. **Home / Galería** — grid de tarjetas con filtros por categoría y buscador
2. **Vista detalle del agente** — descripción extendida (puede ser provista por markdown), capturas/video/demo

### 6. Tecnología — Por qué Astro es buena elección

Astro es **ideal** para este caso por varias razones:

- **Contenido estático curado:** Los agentes son proyectos con información fija que se actualiza ocasionalmente. Astro con archivos Markdown/MDX o una colección de contenido (`content collections`) es perfecto para esto.
- **Performance excelente:** Genera HTML estático — carga instantánea, ideal para presentación en vivo.
- **Sin overhead:** No necesitas un backend ni base de datos. Los datos viven en archivos `.json` o `.md`.
- **Componentes interactivos opcionales:** Si quieres filtros o búsqueda reactiva, puedes añadir una isla de React/Svelte solo donde se necesite (architecture of islands).
- **Despliegue sencillo:** Netlify, Vercel o GitHub Pages — gratis y en minutos.

**Stack sugerido:**
```
Astro 4+
└── Content Collections (para datos de agentes)
└── TailwindCSS (utilidades de estilo)
└── Plus Jakarta Sans (Google Fonts)
└── Un componente React/Svelte para el filtro interactivo (isla)
```

**Para los datos**, cada agente sería un archivo como:
```
src/content/agents/
├── agente-salud-diagnostico.md
├── agente-finanzas-prediccion.md
└── ...
```

Con frontmatter estructurado:
```yaml
---
name: "DiagnostIA"
team: ["Ana García", "Luis Martínez"]
faculty: "Facultad de Ciencias de la Salud"
status: "Beta"
category: "Salud"
tags: ["diagnóstico", "NLP", "imágenes médicas"]
description: "Agente de apoyo al diagnóstico clínico..."
---
```


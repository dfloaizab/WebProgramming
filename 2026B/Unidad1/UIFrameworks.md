# Ejercicio: Mejora de la plataforma “Cali Vigilante” con frameworks CSS

## Objetivo

Aprender a integrar y utilizar **frameworks CSS** (Bootstrap, Tailwind CSS, Foundation, Bulma) para mejorar la apariencia, la experiencia de usuario y la mantenibilidad de una página web ya existente.  
El ejercicio parte del código de una plataforma de registro ciudadano (modo oscuro incluido) y propone rediseñarla aplicando las utilidades de cada framework, comparando sus enfoques.

---

## Introducción a los frameworks CSS

Un **framework CSS** es un conjunto de reglas, clases y componentes predefinidos que agilizan el desarrollo front‑end. Proporcionan:

- **Sistemas de grid** para maquetar de forma responsive.
- **Estilos base** uniformes (tipografía, botones, formularios).
- **Componentes reutilizables** (navbar, tarjetas, modales, etc.).
- **Utilidades** (espaciado, colores, sombras, etc.) que evitan escribir CSS desde cero.

Los frameworks más populares se dividen en dos enfoques:

- **Orientados a componentes** (Bootstrap, Foundation, Materialize): ofrecen componentes listos con estilos predeterminados.
- **Orientados a utilidades** (Tailwind CSS, Tachyons): proporcionan clases atómicas que se combinan para construir diseños personalizados sin salir del HTML.

---

## Frameworks sugeridos

| Framework | Enfoque | CDN / Instalación | Ideal para |
|-----------|---------|-------------------|------------|
| **Bootstrap** | Componentes + Grid | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">` | Proyectos que necesitan una interfaz coherente y rápida, con muchos componentes ya hechos. |
| **Tailwind CSS** | Utilidades (utility‑first) | `npm install -D tailwindcss` o CDN de prueba (`<script src="https://cdn.tailwindcss.com"></script>`) | Proyectos donde se desea un diseño único y se prefiere trabajar directamente en el HTML con clases modulares. |
| **Foundation** | Componentes + Grid | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/foundation-sites@6.8.1/dist/css/foundation.min.css">` | Aplicaciones empresariales que requieren gran flexibilidad y accesibilidad. |
| **Bulma** | Componentes + Flexbox | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css">` | Proyectos que buscan una estética moderna y minimalista, basada en Flexbox. |

---

## Ejercicio práctico: Mejorar “Cali Vigilante” con Tailwind CSS

Tomaremos el código original (HTML, CSS y JS) y lo transformaremos usando **Tailwind CSS** (vía CDN para simplificar). El resultado mantendrá la funcionalidad del modo oscuro pero mejorará:

- **Maquetación responsive** (con las clases de grid y flex de Tailwind).
- **Estilizado de formularios** (inputs, selects, botones).
- **Navegación** (usando clases de Tailwind para la barra de navegación).
- **Tarjetas y secciones** con sombras, bordes redondeados y colores consistentes.

### Paso 1: Incluir Tailwind CSS

Añadimos el script CDN de Tailwind en el `<head>` de `index.html` (también podemos usar el archivo compilado, pero para el ejercicio usaremos el CDN de prueba):

```html
<head>
    <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plataforma para registro de vulneraciones ...</title>
    <!-- Tailwind CSS CDN (versión de desarrollo) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Ya no necesitamos styles.css, pero podemos conservarlo para estilos personalizados puntuales -->
    <link rel="stylesheet" href="styles.css">
</head>

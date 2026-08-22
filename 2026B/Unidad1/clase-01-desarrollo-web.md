# Clase 1 — Introducción al Desarrollo Web
## Proyecto guía: Plataforma ciudadana de registro de abusos de autoridad en Cali

---

## 0. Objetivos de aprendizaje

Al finalizar esta clase el estudiante estará en capacidad de:

1. Explicar el papel de **HTML**, **CSS** y **JavaScript** dentro de la arquitectura de una página web (estructura, presentación, comportamiento).
2. Construir una página con **HTML semántico** (etiquetas con significado, no solo `<div>` genéricos).
3. Aplicar **Flexbox** y nociones básicas de **CSS Grid** para diagramar layouts modernos y responsivos.
4. Capturar datos de un **formulario** con JavaScript y renderizarlos dinámicamente en el DOM, sin recargar la página.
5. Reconocer el flujo completo: el usuario diligencia un formulario → JavaScript lo intercepta → los datos se transforman en contenido visible.

**Contexto pedagógico del proyecto:** se construirá, a modo de ejemplo guiado, el esqueleto de un sitio para el registro ciudadano de presuntos abusos de autoridad en la ciudad de Cali. Es un caso de uso real de "civic tech" (tecnología cívica): existen iniciativas similares en el mundo (HURIDOCS, Ushahidi, plataformas de veedurías ciudadanas) que documentan violaciones de derechos humanos con herramientas web sencillas. Esto permite motivar conceptos técnicos con un problema de alto valor social, y discutir en clase temas transversales como la importancia de la anonimización de denunciantes, la cadena de custodia de la evidencia digital y la seguridad de datos sensibles — temas que pueden retomarse en clases posteriores de seguridad informática.

---

## 1. Actividad en clase (guiada por el docente)

### Paso 1 — Estructura base en HTML semántico

Antes de escribir código, se explica en el tablero la diferencia entre HTML "de sopa de divs" (`<div>` para todo) y HTML semántico, donde cada etiqueta comunica el rol del contenido tanto a otros desarrolladores como a tecnologías de asistencia (lectores de pantalla) y motores de búsqueda.

Etiquetas semánticas clave a introducir:

| Etiqueta | Rol |
|---|---|
| `<header>` | Cabecera de la página o de una sección |
| `<nav>` | Bloque de navegación |
| `<main>` | Contenido principal, único por página |
| `<section>` | Agrupación temática de contenido |
| `<article>` | Contenido autocontenido (ej. un reporte individual) |
| `<aside>` | Contenido complementario (ej. estadísticas, avisos) |
| `<footer>` | Pie de página |
| `<form>` | Formulario de entrada de datos |

Crear el archivo `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cali Vigilante — Registro Ciudadano de Abusos de Autoridad</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <header class="site-header">
    <h1>Cali Vigilante</h1>
    <p class="tagline">Registro ciudadano de presuntos abusos de autoridad</p>
    <nav class="main-nav">
      <ul>
        <li><a href="index.html">Inicio</a></li>
        <li><a href="reportar.html">Reportar un caso</a></li>
        <li><a href="casos.html">Ver casos registrados</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="intro">
      <h2>¿Qué es esta plataforma?</h2>
      <p>
        Este sitio permite a la ciudadanía documentar presuntos casos de abuso
        de autoridad ocurridos en la ciudad de Cali, con el fin de construir
        un registro colectivo que sirva de memoria y evidencia.
      </p>
    </section>

    <section id="formulario-rapido" aria-labelledby="titulo-formulario">
      <h2 id="titulo-formulario">Registrar un nuevo caso</h2>

      <form id="form-reporte">
        <div class="campo">
          <label for="fecha">Fecha del hecho</label>
          <input type="date" id="fecha" name="fecha" required>
        </div>

        <div class="campo">
          <label for="lugar">Lugar (barrio / comuna)</label>
          <input type="text" id="lugar" name="lugar" placeholder="Ej: Comuna 15, Cali" required>
        </div>

        <div class="campo">
          <label for="descripcion">Descripción del hecho</label>
          <textarea id="descripcion" name="descripcion" rows="4" required></textarea>
        </div>

        <div class="campo">
          <label for="autoridad">Autoridad involucrada</label>
          <select id="autoridad" name="autoridad">
            <option value="policia">Policía Nacional</option>
            <option value="esmad">ESMAD</option>
            <option value="ejercito">Ejército</option>
            <option value="otra">Otra</option>
          </select>
        </div>

        <button type="submit">Enviar reporte</button>
      </form>
    </section>

    <section id="lista-casos" aria-labelledby="titulo-casos">
      <h2 id="titulo-casos">Casos registrados</h2>
      <div id="contenedor-casos" class="casos-grid">
        <!-- Aquí JavaScript insertará las tarjetas de cada reporte -->
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p>Proyecto académico — Curso de Desarrollo Web. Datos de ejemplo, no representan casos reales.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

**Puntos para explicar en clase mientras se escribe:**

- `lang="es"` ayuda a lectores de pantalla y motores de búsqueda a identificar el idioma.
- `<meta name="viewport">` es indispensable para que el sitio se vea bien en celulares (diseño responsivo).
- El `<form>` no tiene todavía un `action`; eso es intencional — más adelante JavaScript interceptará el envío.
- `aria-labelledby` conecta una sección con su título para accesibilidad, sin necesidad de librerías adicionales.
- Al abrir `index.html` directamente en el navegador en este punto, el sitio ya es funcional (sin estilos): esto demuestra que **HTML por sí solo ya produce un documento navegable**, y que CSS y JS son capas adicionales.

---

### Paso 2 — Diagramación y estilo con CSS

Se introduce el concepto de **caja (box model)**, y luego **Flexbox** como el mecanismo moderno para alinear y distribuir elementos, en lugar de técnicas antiguas como `float`.

Crear el archivo `styles.css`, construido en capas explicadas una por una:

**2.1 Variables y reseteo base**

```css
:root {
  --color-fondo: #f4f5f7;
  --color-primario: #7a1f2b;   /* rojo institucional, sobrio */
  --color-primario-oscuro: #57151d;
  --color-texto: #212529;
  --color-tarjeta: #ffffff;
  --radio-borde: 8px;
  --espaciado: 1rem;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  background-color: var(--color-fondo);
  color: var(--color-texto);
  line-height: 1.5;
}
```

*Explicar:* `box-sizing: border-box` evita que el padding/borde amplíen el tamaño declarado de los elementos — un dolor de cabeza clásico para principiantes. Las variables CSS (`--color-primario`, etc.) permiten cambiar la paleta del sitio desde un solo lugar.

**2.2 Cabecera con Flexbox**

```css
.site-header {
  background-color: var(--color-primario);
  color: white;
  padding: 1.5rem 2rem;
}

.site-header h1 {
  margin: 0 0 0.25rem 0;
}

.tagline {
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.main-nav ul {
  list-style: none;
  display: flex;           /* <-- Flexbox: distribuye los <li> en fila */
  gap: 1.5rem;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;          /* si no caben, pasan a la siguiente línea */
}

.main-nav a {
  color: white;
  text-decoration: none;
  font-weight: 600;
}

.main-nav a:hover {
  text-decoration: underline;
}
```

*Explicar en vivo:* cambiar `flex-direction` a `column` y observar el efecto; luego volver a `row` (valor por defecto). Esto hace tangible que Flexbox organiza elementos en un eje principal.

**2.3 Contenido principal y formulario**

```css
main {
  max-width: 960px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

section {
  background-color: var(--color-tarjeta);
  border-radius: var(--radio-borde);
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

#form-reporte {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 480px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.campo label {
  font-weight: 600;
  font-size: 0.9rem;
}

.campo input,
.campo textarea,
.campo select {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: var(--radio-borde);
  font: inherit;
}

button[type="submit"] {
  align-self: flex-start;
  background-color: var(--color-primario);
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: var(--radio-borde);
  font-weight: 600;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: var(--color-primario-oscuro);
}
```

**2.4 Grilla de tarjetas con CSS Grid**

Aquí se introduce Grid como complemento de Flexbox: Flexbox es ideal para una fila o columna; Grid es ideal para una **cuadrícula bidimensional** de tarjetas.

```css
.casos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.tarjeta-caso {
  border: 1px solid #e2e2e2;
  border-radius: var(--radio-borde);
  padding: 1rem;
  background-color: #fafafa;
}

.tarjeta-caso h3 {
  margin-top: 0;
  font-size: 1rem;
  color: var(--color-primario-oscuro);
}

.tarjeta-caso .meta {
  font-size: 0.8rem;
  color: #666;
}
```

*Explicar:* `repeat(auto-fill, minmax(240px, 1fr))` es la línea que hace el diseño **responsivo sin media queries**: el navegador calcula solas cuántas columnas caben. Vale la pena redimensionar la ventana del navegador en vivo para que el efecto se vea.

**2.5 Pie de página**

```css
.site-footer {
  text-align: center;
  padding: 1.5rem;
  font-size: 0.85rem;
  color: #666;
}
```

Al terminar este paso, el sitio ya luce como una aplicación web moderna, aunque el formulario todavía no hace nada al enviarse.

---

### Paso 3 — Interactividad con JavaScript

Se explica el DOM (Document Object Model) como la representación en memoria del HTML que JavaScript puede leer y modificar, y el concepto de **evento** (una acción del usuario que dispara código).

Crear el archivo `script.js`:

```javascript
// 1. Seleccionamos los elementos del DOM que vamos a usar
const formulario = document.getElementById('form-reporte');
const contenedorCasos = document.getElementById('contenedor-casos');

// 2. Un arreglo en memoria para guardar los casos durante la sesión
//    (más adelante, como ejercicio, se puede persistir con localStorage)
let casos = [];

// 3. Función que construye el HTML de una tarjeta a partir de un caso
function crearTarjetaCaso(caso) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta-caso';

  tarjeta.innerHTML = `
    <h3>${caso.lugar}</h3>
    <p class="meta">${caso.fecha} · ${caso.autoridad}</p>
    <p>${caso.descripcion}</p>
  `;

  return tarjeta;
}

// 4. Función que vuelve a pintar toda la lista de casos
function renderizarCasos() {
  contenedorCasos.innerHTML = ''; // limpiamos el contenedor

  if (casos.length === 0) {
    contenedorCasos.innerHTML = '<p>Aún no hay casos registrados.</p>';
    return;
  }

  casos.forEach(caso => {
    const tarjeta = crearTarjetaCaso(caso);
    contenedorCasos.appendChild(tarjeta);
  });
}

// 5. Escuchamos el evento "submit" del formulario
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  const nuevoCaso = {
    fecha: document.getElementById('fecha').value,
    lugar: document.getElementById('lugar').value,
    descripcion: document.getElementById('descripcion').value,
    autoridad: document.getElementById('autoridad').value,
  };

  casos.push(nuevoCaso);
  renderizarCasos();
  formulario.reset(); // limpia los campos del formulario
});

// 6. Primer render al cargar la página (lista vacía)
renderizarCasos();
```

**Puntos para explicar en clase mientras se escribe:**

- `evento.preventDefault()` es la línea clave: sin ella, el navegador intentaría enviar el formulario a un servidor y recargar la página (comportamiento por defecto de HTML). Al interceptarlo, JavaScript toma el control.
- `document.getElementById(...).value` es cómo JavaScript "lee" lo que el usuario escribió.
- `innerHTML` con *template literals* (comillas invertidas y `${...}`) es la forma más directa de generar HTML dinámico; se puede mencionar que en proyectos grandes se usan frameworks (React, Vue) para esto de forma más segura y eficiente, pero que el mecanismo de fondo es el mismo: datos → DOM.
- Al final de este paso, el estudiante puede diligenciar el formulario y ver aparecer su reporte al instante, sin recargar la página — el "momento aha" de la clase.

---

## 2. Actividad para la casa (tarea individual)

El estudiante debe partir del sitio construido en clase y entregar una versión ampliada con lo siguiente:

### 2.1 Nuevas páginas

1. **`reportar.html`** — una versión del formulario como página independiente (ya referenciada en el menú de navegación), con validaciones adicionales en HTML5 (`pattern`, `minlength`, mensajes de error personalizados con `setCustomValidity`).
2. **`casos.html`** — una página dedicada exclusivamente a listar todos los casos registrados, con:
   - Un campo de búsqueda por lugar o palabra clave.
   - Un filtro (`<select>`) por tipo de autoridad, usando `Array.prototype.filter()` en JavaScript.

### 2.2 Funcionalidades adicionales propuestas (elegir al menos dos)

- **Persistencia con `localStorage`**: guardar los casos en el navegador para que no se pierdan al recargar la página (`localStorage.setItem` / `getItem` con `JSON.stringify` / `JSON.parse`).
- **Contador dinámico**: mostrar en la cabecera cuántos casos hay registrados en total, actualizado en tiempo real.
- **Ordenar por fecha**: un botón que reordene las tarjetas de la más reciente a la más antigua.
- **Modo oscuro**: un botón que alterne una clase `.dark-mode` en el `<body>`, con las reglas CSS correspondientes usando variables.
- **Validación de campos vacíos con retroalimentación visual**: resaltar en rojo los campos que fallen la validación antes de permitir el envío.
- **Responsive avanzado**: usar *media queries* (`@media (max-width: 600px)`) para ajustar el menú de navegación a formato de columna en pantallas pequeñas.

### 2.3 Criterios de evaluación sugeridos

| Criterio | Peso |
|---|---|
| Uso correcto de HTML semántico en las tres páginas | 20% |
| Consistencia visual entre páginas (CSS compartido) | 20% |
| Uso de Flexbox y/o Grid para el layout | 20% |
| Funcionalidad JavaScript del formulario replicada correctamente | 20% |
| Al menos dos funcionalidades adicionales implementadas | 20% |

---

## 3. Cierre de la clase

Se recomienda cerrar la sesión retomando la analogía:

- **HTML** = el esqueleto y los órganos (qué hay y qué función cumple cada parte).
- **CSS** = la piel, la ropa (cómo se ve).
- **JavaScript** = el sistema nervioso (cómo reacciona a lo que pasa).

Y conectar con la relevancia social del proyecto guía: las mismas herramientas básicas que se acaban de aprender son la base de plataformas reales de documentación de derechos humanos usadas por organizaciones en todo el mundo — la tecnología web, incluso en su forma más elemental, puede ser una herramienta de memoria y de rendición de cuentas.

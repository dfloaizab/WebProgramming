# PROGRAMACIÓN ORIENTADA A LA WEB
## UNIVERSIDAD SANTIAGO DE CALI, 2026B
## Instructivo — Implementando "Modo Oscuro"
### Introducción práctica a JavaScript y manipulación del DOM

Este instructivo continúa el proyecto de la Clase 1 (plataforma de registro de casos). Se usará como excusa para introducir, de forma incremental y sencilla, los mecanismos centrales de manipulación del DOM con JavaScript: seleccionar elementos, modificar clases, escuchar eventos y guardar el estado del usuario.

---

## 0. ¿Qué vamos a construir?

Un botón en la cabecera del sitio que, al hacer clic, alterna entre el tema claro (el que ya existe) y un tema oscuro. La preferencia del usuario se recordará aunque cierre y vuelva a abrir la página.

**Concepto central que se enseña:** JavaScript no "pinta" directamente los colores; JavaScript **agrega o quita una clase** en el HTML, y es **CSS** quien decide cómo se ve esa clase. Esta separación de responsabilidades es una de las ideas más importantes del desarrollo web moderno.

---

## Paso 1 — Preparar el CSS para dos temas

Antes de tocar JavaScript, hay que darle a CSS "algo que alternar". La forma más sencilla y didáctica es usar **variables CSS** (ya introducidas en la clase anterior) y redefinirlas cuando el `<body>` tenga una clase especial.

En `styles.css`, ubicar el bloque `:root` que ya existe y dejarlo así:

```css
:root {
  --color-fondo: #f4f5f7;
  --color-primario: #7a1f2b;
  --color-primario-oscuro: #57151d;
  --color-texto: #212529;
  --color-tarjeta: #ffffff;
  --radio-borde: 8px;
  --espaciado: 1rem;
}

/* Nuevo: variables alternativas para el tema oscuro */
body.dark-mode {
  --color-fondo: #121417;
  --color-texto: #e6e6e6;
  --color-tarjeta: #1e2126;
  --color-primario: #b34754;
  --color-primario-oscuro: #7a1f2b;
}
```

**Explicación clave:** no se escribió ni una sola regla nueva de color en ningún selector (`section`, `.tarjeta-caso`, etc.). Como esos selectores ya usan `var(--color-fondo)`, `var(--color-texto)`, etc., **automáticamente heredan el tema oscuro** en cuanto el `<body>` tenga la clase `dark-mode`. Vale la pena resaltar esto en clase: es el resultado de haber usado variables desde el principio, en vez de colores "quemados" (hardcoded) en cada regla.

Agregar también una transición suave, puramente cosmética:

```css
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

---

## Paso 2 — Agregar el botón en el HTML

En `index.html` (y luego en las demás páginas), dentro de `<header class="site-header">`, agregar el botón junto a la navegación:

```html
<header class="site-header">
  <h1>Cali Vigilante</h1>
  <p class="tagline">Registro ciudadano de presuntos abusos de autoridad</p>

  <button id="boton-tema" class="boton-tema" aria-pressed="false">
    🌙 Modo oscuro
  </button>

  <nav class="main-nav">
    ...
  </nav>
</header>
```

**Explicación:** `aria-pressed="false"` es un atributo de accesibilidad que indica a lectores de pantalla que este botón tiene un estado "activado/desactivado" (como un interruptor). Lo actualizaremos desde JavaScript.

Un estilo mínimo para que no se vea desalineado:

```css
.boton-tema {
  align-self: flex-start;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.4);
  color: white;
  padding: 0.4rem 0.9rem;
  border-radius: var(--radio-borde);
  cursor: pointer;
  margin-bottom: 1rem;
}
```

---

## Paso 3 — Manipular el DOM con JavaScript

Este es el núcleo del instructivo. Se construye en pequeños incrementos, cada uno introduciendo un concepto nuevo de manipulación del DOM.

### 3.1 Seleccionar el elemento

En `script.js`, al inicio del archivo:

```javascript
// document.getElementById busca en el DOM un elemento por su atributo id
const botonTema = document.getElementById('boton-tema');
```

*Explicar:* `document` es el objeto que representa toda la página en memoria (el DOM). `getElementById` es el método más simple y directo para "agarrar" un elemento específico y guardarlo en una variable para poder manipularlo después.

### 3.2 Escuchar el clic

```javascript
botonTema.addEventListener('click', function () {
  // Por ahora, solo confirmamos que el evento funciona
  console.log('¡Se hizo clic en el botón de tema!');
});
```

*Explicar:* `addEventListener` no ejecuta el código inmediatamente — le dice al navegador "cuando ocurra este evento (`click`) en este elemento, ejecuta esta función". Es la base de toda interactividad en la web. Sugerencia: abrir la consola del navegador (F12) y hacer clic para ver el mensaje, antes de seguir.

### 3.3 Modificar una clase del `<body>`

Aquí ocurre la manipulación real del DOM:

```javascript
botonTema.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
});
```

*Explicar en detalle:*

- `document.body` selecciona directamente la etiqueta `<body>`.
- `classList` es una propiedad especial que representa la lista de clases CSS de un elemento, con métodos útiles:
  - `.add('clase')` — agrega la clase si no está.
  - `.remove('clase')` — la quita si está.
  - `.toggle('clase')` — la agrega si no está, o la quita si ya está (justo lo que necesitamos para un interruptor).
  - `.contains('clase')` — devuelve `true` o `false` según si la clase está presente.

En este punto, el botón ya funciona: cada clic alterna el tema. Es un buen momento para pausar y dejar que los estudiantes lo prueben.

### 3.4 Sincronizar el texto del botón y la accesibilidad

Para que el botón "sepa" en qué estado está y lo comunique:

```javascript
function actualizarBotonTema() {
  const modoOscuroActivo = document.body.classList.contains('dark-mode');

  botonTema.textContent = modoOscuroActivo ? '☀️ Modo claro' : '🌙 Modo oscuro';
  botonTema.setAttribute('aria-pressed', modoOscuroActivo);
}

botonTema.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  actualizarBotonTema();
});
```

*Explicar:*

- `textContent` cambia el texto visible de un elemento (manipulación de contenido, no solo de clases).
- El operador ternario (`condición ? valorSiVerdadero : valorSiFalso`) es una forma compacta de un `if/else` que aquí decide qué texto e ícono mostrar.
- `setAttribute` permite modificar cualquier atributo HTML del elemento, en este caso `aria-pressed`, manteniendo la accesibilidad sincronizada con el estado real.

### 3.5 Recordar la preferencia del usuario con `localStorage`

Último incremento: que la preferencia sobreviva a recargar la página.

```javascript
// Al cargar la página, revisamos si ya había una preferencia guardada
const temaGuardado = localStorage.getItem('tema');

if (temaGuardado === 'oscuro') {
  document.body.classList.add('dark-mode');
}

actualizarBotonTema(); // aseguramos que el botón refleje el estado inicial

botonTema.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  actualizarBotonTema();

  // Guardamos la preferencia actual para la próxima visita
  const modoOscuroActivo = document.body.classList.contains('dark-mode');
  localStorage.setItem('tema', modoOscuroActivo ? 'oscuro' : 'claro');
});
```

*Explicar:*

- `localStorage` es un pequeño almacenamiento que el navegador guarda por sitio web, y que persiste incluso después de cerrar la pestaña o el navegador.
- `localStorage.setItem(clave, valor)` guarda un dato; `localStorage.getItem(clave)` lo recupera. Solo se pueden guardar cadenas de texto (por eso se guarda `'oscuro'` o `'claro'`, no `true`/`false` directamente).
- Este es el primer contacto de los estudiantes con la idea de que una página web puede "recordar" algo entre visitas sin necesidad de un servidor o una base de datos.

---

## Paso 4 — Código final de `script.js` (fragmento de modo oscuro)

Para referencia, así queda el bloque completo, listo para pegar al inicio del archivo `script.js` ya existente:

```javascript
const botonTema = document.getElementById('boton-tema');

function actualizarBotonTema() {
  const modoOscuroActivo = document.body.classList.contains('dark-mode');
  botonTema.textContent = modoOscuroActivo ? '☀️ Modo claro' : '🌙 Modo oscuro';
  botonTema.setAttribute('aria-pressed', modoOscuroActivo);
}

const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'oscuro') {
  document.body.classList.add('dark-mode');
}
actualizarBotonTema();

botonTema.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  actualizarBotonTema();
  const modoOscuroActivo = document.body.classList.contains('dark-mode');
  localStorage.setItem('tema', modoOscuroActivo ? 'oscuro' : 'claro');
});
```

---

## 5. Resumen de conceptos de DOM introducidos

| Concepto | Método / propiedad usada | Qué hace |
|---|---|---|
| Seleccionar un elemento | `document.getElementById()` | Ubica un nodo del DOM por su `id` |
| Escuchar eventos | `elemento.addEventListener()` | Ejecuta una función cuando ocurre una acción del usuario |
| Modificar clases | `elemento.classList.add / remove / toggle / contains` | Cambia qué reglas CSS aplican a un elemento |
| Cambiar contenido de texto | `elemento.textContent` | Reemplaza el texto visible de un elemento |
| Modificar atributos | `elemento.setAttribute()` | Cambia cualquier atributo HTML de un elemento |
| Persistir datos en el navegador | `localStorage.setItem / getItem` | Guarda y recupera datos entre sesiones |

---

## 6. Ejercicio propuesto 

1. Replicar el botón de modo oscuro en `reportar.html` y `casos.html`, asegurándose de que la preferencia guardada en `localStorage` se respete al entrar a cualquiera de las tres páginas (es decir, `script.js` debe estar enlazado en las tres).
2. Agregar una regla CSS adicional dentro de `body.dark-mode` para que las tarjetas de casos (`.tarjeta-caso`) tengan un borde más sutil y legible sobre fondo oscuro.
3. **Reto opcional:** en lugar de un ícono fijo de luna/sol, detectar la preferencia del sistema operativo del usuario con `window.matchMedia('(prefers-color-scheme: dark)')` y usarla como valor inicial la primera vez que alguien visita el sitio (es decir, antes de que exista una preferencia guardada en `localStorage`).

# Programación Orientada a la Web
# Universidad Santiago de Cali, 2026
# Introducción a HTML y CSS


Este documento le proporcionará una introducción completa a HTML y CSS, las dos tecnologías fundamentales para la creación de sitios web. HTML (HyperText Markup Language) es el lenguaje de marcado que estructura el contenido de las páginas web, mientras que CSS (Cascading Style Sheets) es el lenguaje que controla la presentación visual de ese contenido.

## Fundamentos de HTML

HTML es el esqueleto de cualquier página web. Funciona mediante etiquetas que envuelven diferentes tipos de contenido y le dan significado semántico. Cada documento HTML tiene una estructura básica que debe seguir para ser válido.

### Estructura básica de un documento HTML

Todo documento HTML comienza con una declaración de tipo de documento y contiene dos secciones principales: el head (encabezado) y el body (cuerpo). En el head se incluye información sobre el documento, como el título y los enlaces a hojas de estilo. En el body se coloca todo el contenido visible de la página.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Primera Página Web</title>
</head>
<body>
    <h1>Bienvenido a mi sitio web</h1>
    <p>Este es mi primer párrafo en HTML.</p>
</body>
</html>
```

### Etiquetas fundamentales de HTML

Las etiquetas de encabezado van desde h1 hasta h6, siendo h1 el más importante y h6 el menos importante. Estas etiquetas no solo definen el tamaño del texto, sino también la jerarquía semántica del contenido. Los párrafos se definen con la etiqueta p, que crea bloques de texto separados con márgenes automáticos.

Los enlaces se crean con la etiqueta a (anchor) y requieren el atributo href que especifica la dirección de destino. Las imágenes se insertan con la etiqueta img, que necesita el atributo src para la ruta de la imagen y alt para el texto alternativo.

```html
<h1>Título Principal</h1>
<h2>Subtítulo</h2>
<h3>Sección</h3>

<p>Este es un párrafo de texto. Puede contener <strong>texto en negrita</strong> 
y <em>texto en cursiva</em>.</p>

<a href="https://www.ejemplo.com">Visite nuestro sitio</a>

<img src="imagen.jpg" alt="Descripción de la imagen">
```

### Listas en HTML

HTML ofrece dos tipos principales de listas. Las listas ordenadas (ol) se utilizan cuando el orden de los elementos es importante, como en instrucciones paso a paso. Las listas desordenadas (ul) se usan cuando el orden no importa, como en una lista de características. Cada elemento de la lista se define con la etiqueta li.

```html
<h3>Lista ordenada de pasos:</h3>
<ol>
    <li>Abra el navegador web</li>
    <li>Escriba la dirección del sitio</li>
    <li>Presione Enter para navegar</li>
</ol>

<h3>Lista desordenada de características:</h3>
<ul>
    <li>Diseño responsivo</li>
    <li>Carga rápida</li>
    <li>Interfaz intuitiva</li>
</ul>
```

### Elementos semánticos de HTML5

HTML5 introdujo elementos semánticos que dan significado al contenido más allá de su presentación visual. Estos elementos ayudan a los motores de búsqueda y tecnologías asistivas a entender mejor la estructura de la página.

El elemento header define el encabezado de la página o de una sección. El nav contiene los enlaces de navegación principales. El main engloba el contenido principal único de la página. El article representa contenido independiente que podría distribuirse por separado. El section agrupa contenido relacionado temáticamente. El aside contiene contenido complementario. El footer define el pie de página.

```html
<header>
    <h1>Mi Blog Personal</h1>
    <nav>
        <a href="#inicio">Inicio</a>
        <a href="#sobre-mi">Sobre mí</a>
        <a href="#contacto">Contacto</a>
    </nav>
</header>

<main>
    <article>
        <h2>Título del artículo</h2>
        <p>Contenido del artículo...</p>
    </article>
    
    <aside>
        <h3>Artículos relacionados</h3>
        <p>Enlaces a otros contenidos...</p>
    </aside>
</main>

<footer>
    <p>Derechos reservados 2024</p>
</footer>
```

### Tablas en HTML

Las tablas se utilizan para presentar datos tabulares. Se construyen con la etiqueta table, que contiene filas (tr) y celdas. Las celdas de encabezado se definen con th y las celdas de datos con td.

```html
<table>
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Ciudad</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Ana García</td>
            <td>28</td>
            <td>Madrid</td>
        </tr>
        <tr>
            <td>Carlos López</td>
            <td>35</td>
            <td>Barcelona</td>
        </tr>
    </tbody>
</table>
```

### Formularios en HTML

Los formularios permiten la interacción del usuario con la página web. Se crean con la etiqueta form y contienen diversos campos de entrada. El atributo action especifica dónde se enviarán los datos y method define cómo se enviarán (generalmente GET o POST).

```html
<form action="/procesar" method="POST">
    <label for="nombre">Nombre completo:</label>
    <input type="text" id="nombre" name="nombre" required>
    
    <label for="email">Correo electrónico:</label>
    <input type="email" id="email" name="email" required>
    
    <label for="mensaje">Mensaje:</label>
    <textarea id="mensaje" name="mensaje" rows="4"></textarea>
    
    <label for="pais">País:</label>
    <select id="pais" name="pais">
        <option value="es">España</option>
        <option value="mx">México</option>
        <option value="ar">Argentina</option>
    </select>
    
    <button type="submit">Enviar</button>
</form>
```

## Fundamentos de CSS

CSS es el lenguaje que controla la presentación visual de los documentos HTML. Mientras HTML define la estructura y el contenido, CSS define colores, tipografía, espaciado, posicionamiento y diseño general.

### Sintaxis básica de CSS

Una regla CSS consiste en un selector que identifica los elementos HTML a los que se aplicará el estilo, seguido de un bloque de declaraciones entre llaves. Cada declaración contiene una propiedad y su valor, separados por dos puntos y terminados con punto y coma.

```css
selector {
    propiedad: valor;
    otra-propiedad: otro-valor;
}
```

### Formas de incorporar CSS

Existen tres formas de aplicar CSS a un documento HTML. El CSS inline se escribe directamente en el atributo style de un elemento HTML, pero no es recomendable porque mezcla contenido y presentación. El CSS interno se coloca dentro de una etiqueta style en el head del documento HTML. El CSS externo se escribe en un archivo separado con extensión .css y se vincula mediante la etiqueta link, siendo esta la forma más recomendada para proyectos de cualquier tamaño.

```html
<!-- CSS Inline (no recomendado) -->
<p style="color: blue; font-size: 16px;">Texto en azul</p>

<!-- CSS Interno -->
<head>
    <style>
        p {
            color: blue;
            font-size: 16px;
        }
    </style>
</head>

<!-- CSS Externo (recomendado) -->
<head>
    <link rel="stylesheet" href="estilos.css">
</head>
```

### Selectores CSS

Los selectores determinan a qué elementos HTML se aplicarán los estilos. El selector de tipo selecciona todos los elementos de ese tipo. El selector de clase se identifica con un punto y puede aplicarse a múltiples elementos. El selector de ID se identifica con un numeral y debe ser único en la página. Los selectores pueden combinarse para mayor especificidad.

```css
/* Selector de tipo */
p {
    color: #333;
}

/* Selector de clase */
.destacado {
    background-color: yellow;
    font-weight: bold;
}

/* Selector de ID */
#encabezado-principal {
    font-size: 32px;
    text-align: center;
}

/* Selector descendente */
article p {
    line-height: 1.6;
}

/* Selector de múltiples clases */
.boton.primario {
    background-color: blue;
    color: white;
}
```

### Propiedades de texto y tipografía

CSS ofrece numerosas propiedades para controlar la apariencia del texto. La propiedad font-family define la fuente tipográfica, font-size controla el tamaño, color establece el color del texto, text-align controla la alineación, line-height define el espaciado entre líneas, y text-decoration puede añadir o quitar subrayados.

```css
.texto-ejemplo {
    font-family: 'Arial', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    text-align: justify;
    line-height: 1.8;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}
```

### Modelo de caja (Box Model)

Cada elemento HTML es una caja rectangular compuesta por cuatro áreas. El contenido es el área donde aparece el texto o las imágenes. El padding es el espacio entre el contenido y el borde. El border es la línea que rodea el padding y el contenido. El margin es el espacio exterior que separa el elemento de otros elementos.

```css
.caja {
    width: 300px;
    height: 200px;
    padding: 20px;
    border: 2px solid #333;
    margin: 15px;
    box-sizing: border-box; /* Incluye padding y border en width/height */
}
```

### Colores y fondos

CSS permite definir colores de múltiples formas. Puede usar nombres de colores predefinidos, valores hexadecimales, valores RGB o RGBA (con transparencia). Los fondos pueden ser colores sólidos, gradientes o imágenes.

```css
.colores-ejemplo {
    /* Diferentes formas de definir colores */
    color: blue;
    color: #3498db;
    color: rgb(52, 152, 219);
    color: rgba(52, 152, 219, 0.8);
    
    /* Fondos */
    background-color: #ecf0f1;
    background-image: url('fondo.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.gradiente {
    background: linear-gradient(to right, #3498db, #2ecc71);
}
```

### Display y posicionamiento

La propiedad display controla cómo se comporta un elemento en el flujo del documento. Los valores comunes son block (ocupa todo el ancho disponible), inline (solo ocupa el espacio de su contenido), inline-block (combina características de ambos) y none (oculta el elemento).

La propiedad position controla el posicionamiento de los elementos. El valor static es el predeterminado. El relative permite desplazar el elemento desde su posición normal. El absolute posiciona el elemento respecto a su ancestro posicionado más cercano. El fixed posiciona el elemento respecto a la ventana del navegador. El sticky combina relative y fixed.

```css
.bloque {
    display: block;
    width: 100%;
}

.inline {
    display: inline-block;
    width: 200px;
}

.posicion-relativa {
    position: relative;
    top: 10px;
    left: 20px;
}

.posicion-absoluta {
    position: absolute;
    top: 0;
    right: 0;
}

.cabecera-fija {
    position: fixed;
    top: 0;
    width: 100%;
    background: white;
    z-index: 100;
}
```

### Flexbox

Flexbox es un sistema de diseño unidimensional que facilita la distribución y alineación de elementos en un contenedor. El contenedor padre se define con display flex, y los elementos hijos se distribuyen automáticamente según las propiedades de flexbox.

```css
.contenedor-flex {
    display: flex;
    justify-content: space-between; /* Alineación horizontal */
    align-items: center; /* Alineación vertical */
    flex-wrap: wrap; /* Permite que los elementos pasen a la siguiente línea */
    gap: 20px; /* Espacio entre elementos */
}

.elemento-flex {
    flex: 1; /* Crece para llenar el espacio disponible */
    min-width: 200px;
}
```

### Grid CSS

CSS Grid es un sistema de diseño bidimensional que permite crear layouts complejos con filas y columnas. Es ideal para diseños de página completos y componentes con estructura de cuadrícula.

```css
.contenedor-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Tres columnas iguales */
    grid-template-rows: auto;
    gap: 20px;
    padding: 20px;
}

.grid-complejo {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 100px 1fr 80px;
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";
}

.cabecera-grid {
    grid-area: header;
}
```

### Diseño responsivo

El diseño responsivo permite que las páginas web se adapten a diferentes tamaños de pantalla. Las media queries permiten aplicar estilos específicos según las características del dispositivo.

```css
/* Estilos base para móviles */
.contenedor {
    width: 100%;
    padding: 10px;
}

/* Tablets */
@media (min-width: 768px) {
    .contenedor {
        width: 750px;
        margin: 0 auto;
        padding: 20px;
    }
}

/* Escritorio */
@media (min-width: 1024px) {
    .contenedor {
        width: 960px;
    }
    
    .columna {
        width: 50%;
        float: left;
    }
}
```

## Ejercicios prácticos

### Ejercicio 1: Página personal básica

Cree una página HTML personal que incluya un encabezado con su nombre, una sección "Sobre mí" con un párrafo descriptivo, una lista de sus habilidades o intereses, y un pie de página con información de contacto. Aplique CSS para personalizar los colores, tipografía y espaciado.

Requisitos específicos: utilice etiquetas semánticas como header, main y footer. Aplique una fuente personalizada de Google Fonts. Defina un esquema de colores coherente con al menos tres colores. Centre el contenido principal con un ancho máximo de 800 píxeles.

### Ejercicio 2: Tarjetas de productos

Diseñe tres tarjetas de productos utilizando HTML y CSS. Cada tarjeta debe incluir una imagen, un título, una breve descripción y un botón de "Comprar". Utilice Flexbox para alinear las tarjetas horizontalmente y asegúrese de que sean responsivas.

Requisitos específicos: las tarjetas deben tener sombras y bordes redondeados. El botón debe cambiar de color al pasar el cursor sobre él (pseudo-clase hover). En dispositivos móviles, las tarjetas deben apilarse verticalmente.

### Ejercicio 3: Formulario de contacto estilizado

Cree un formulario de contacto completo con campos para nombre, correo electrónico, teléfono, asunto y mensaje. Aplique estilos CSS que mejoren la usabilidad y apariencia del formulario.

Requisitos específicos: los campos deben tener bordes visibles y cambiar de color al enfocarse. Las etiquetas deben estar claramente asociadas con sus campos. Incluya validación HTML5 usando atributos como required, type="email" y pattern. El botón de envío debe destacarse visualmente.

### Ejercicio 4: Layout con Grid

Desarrolle una página con un layout completo utilizando CSS Grid. La página debe incluir un encabezado que ocupe todo el ancho, una barra lateral izquierda, un área de contenido principal, una barra lateral derecha y un pie de página.

Requisitos específicos: el encabezado debe tener 100 píxeles de altura. Las barras laterales deben tener 200 píxeles de ancho cada una. El contenido principal debe ocupar el espacio restante. En pantallas menores a 768 píxeles, las barras laterales deben ocultarse o moverse debajo del contenido principal.

### Ejercicio 5: Galería de imágenes responsiva

Construya una galería de imágenes que muestre entre 3 y 4 imágenes por fila según el tamaño de pantalla. Las imágenes deben tener el mismo tamaño y espaciado uniforme entre ellas.

Requisitos específicos: utilice CSS Grid o Flexbox para la distribución. Las imágenes deben cubrir completamente su contenedor sin distorsionarse (object-fit). Añada un efecto de zoom suave al pasar el cursor sobre cada imagen. Incluya un título o descripción que aparezca al hacer hover sobre cada imagen.

## Recursos adicionales para continuar aprendiendo

Para profundizar en HTML y CSS, considere explorar documentación oficial en MDN Web Docs, que ofrece referencias completas y tutoriales detallados. Practique regularmente creando proyectos personales que le interesen. Estudie el código fuente de sitios web que admire usando las herramientas de desarrollo del navegador. Explore frameworks CSS como Bootstrap o Tailwind cuando se sienta cómodo con CSS puro. Manténgase actualizado sobre nuevas características y mejores prácticas, ya que estas tecnologías continúan evolucionando.

La mejor forma de aprender desarrollo web es mediante la práctica constante y la construcción de proyectos reales. Comience con ejercicios simples y gradualmente aumente la complejidad a medida que adquiera confianza en sus habilidades.

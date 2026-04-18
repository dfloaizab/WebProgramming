# Programacion Web - Universidad Santiago de Cali - 2026
# CORS y Consumo de una API REST con NestJS desde una pagina HTML

> **Guia paso a paso** para comprender que es CORS, como configurarlo en una API REST construida con NestJS, y como consumir dicha API desde una pagina web estatica con HTML y JavaScript.

---

## Tabla de Contenidos

1. [Que es CORS y por que es necesario](#1-que-es-cors-y-por-que-es-necesario)
2. [Configuracion de CORS en NestJS](#2-configuracion-de-cors-en-nestjs)
3. [Creacion de una pagina HTML que consume la API](#3-creacion-de-una-pagina-html-que-consume-la-api)
4. [Referencias Bibliograficas](#referencias-bibliograficas)

---

## 1. Que es CORS y por que es necesario

### 1.1 El modelo de seguridad del navegador

Los navegadores web implementan una politica de seguridad denominada **Same-Origin Policy** (Politica del Mismo Origen). Esta politica impide que una pagina web realice solicitudes HTTP a un dominio distinto al que sirvio esa pagina, a menos que el servidor de destino lo permita de forma explicita.

Un **origen** se define por la combinacion de tres componentes:

```
origen = protocolo + dominio + puerto

Ejemplo:
  http://localhost:3000   -->  protocolo: http | dominio: localhost | puerto: 3000
  http://localhost:5500   -->  protocolo: http | dominio: localhost | puerto: 5500

Aunque ambos comparten el mismo protocolo y dominio, el puerto diferente
los convierte en origenes distintos.
```

Por tanto, si una pagina HTML servida en el puerto `5500` intenta hacer una solicitud a una API en el puerto `3000`, el navegador bloqueara dicha solicitud por infringir la Same-Origin Policy.

### 1.2 Que es CORS

**CORS** (*Cross-Origin Resource Sharing*, o Intercambio de Recursos entre Origenes Cruzados) es un mecanismo estandarizado por la W3C que permite a los servidores indicar explicitamente que origenes externos tienen permiso para acceder a sus recursos.

CORS no es una medida de seguridad por si misma: es un mecanismo de relajacion controlada de la Same-Origin Policy. La seguridad sigue recayendo en el servidor, que decide que origenes autoriza.

### 1.3 Como funciona CORS a nivel de protocolo HTTP

Cuando el navegador detecta que una solicitud va dirigida a un origen diferente, actua de una de las siguientes dos formas:

#### Solicitudes simples

Para metodos como `GET` o `POST` con ciertos tipos de contenido, el navegador adjunta automaticamente una cabecera `Origin` a la solicitud. El servidor debe responder con la cabecera `Access-Control-Allow-Origin` para indicar que el origen esta permitido.

```
Solicitud del navegador:
  GET /estudiantes HTTP/1.1
  Origin: http://localhost:5500

Respuesta del servidor:
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: http://localhost:5500
```

#### Solicitudes con preflight

Para solicitudes mas complejas (por ejemplo, `POST` con `Content-Type: application/json`, o metodos como `PUT`, `DELETE`, `PATCH`), el navegador envia primero una solicitud preliminar de tipo `OPTIONS`, llamada **preflight request**, para verificar si el servidor acepta la operacion.

```
Preflight (enviado automaticamente por el navegador):
  OPTIONS /estudiantes HTTP/1.1
  Origin: http://localhost:5500
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: Content-Type

Respuesta del servidor al preflight:
  HTTP/1.1 204 No Content
  Access-Control-Allow-Origin: http://localhost:5500
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Content-Type

Luego el navegador envia la solicitud real:
  POST /estudiantes HTTP/1.1
  Origin: http://localhost:5500
  Content-Type: application/json
```

### 1.4 Diagrama del flujo CORS con preflight

```
Pagina HTML                  Navegador                   API NestJS
(localhost:5500)             (intermediario)             (localhost:3000)
       |                          |                            |
       |--- fetch POST ---------->|                            |
       |                          |                            |
       |                          |-- OPTIONS /estudiantes --->|
       |                          |   (preflight automatico)   |
       |                          |                            |
       |                          |<-- 204 No Content ---------|
       |                          |   Access-Control-Allow-*   |
       |                          |                            |
       |                          |-- POST /estudiantes ------>|
       |                          |   (solicitud real)         |
       |                          |                            |
       |                          |<-- 201 Created ------------|
       |                          |   Access-Control-Allow-*   |
       |                          |                            |
       |<-- respuesta JSON -------|                            |
```

### 1.5 Cabeceras CORS mas importantes

| Cabecera                           | Direccion     | Descripcion                                              |
|------------------------------------|--------------|----------------------------------------------------------|
| `Access-Control-Allow-Origin`      | Respuesta    | Origenes autorizados (`*` o un dominio especifico)       |
| `Access-Control-Allow-Methods`     | Respuesta    | Metodos HTTP permitidos                                  |
| `Access-Control-Allow-Headers`     | Respuesta    | Cabeceras permitidas en la solicitud                     |
| `Access-Control-Allow-Credentials` | Respuesta    | Permite enviar cookies o cabeceras de autenticacion      |
| `Access-Control-Max-Age`           | Respuesta    | Segundos que el navegador puede cachear el preflight     |
| `Origin`                           | Solicitud    | Origen desde el que se hace la solicitud                 |

> **Nota sobre el uso de `*`:** El valor `Access-Control-Allow-Origin: *` permite el acceso desde cualquier origen. Es util en entornos de desarrollo, pero en produccion se recomienda especificar los origenes autorizados de forma explicita.

---

## 2. Configuracion de CORS en NestJS

### 2.1 Habilitacion basica de CORS

NestJS ofrece soporte nativo para CORS a traves del metodo `app.enableCors()` disponible en la instancia de la aplicacion. Esta configuracion se realiza en el archivo `src/main.ts`.

La forma mas simple de habilitarlo es la siguiente:

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS con configuracion permisiva (solo para desarrollo)
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log('API corriendo en http://localhost:3000');
}
bootstrap();
```

Cuando se llama `enableCors()` sin argumentos, NestJS aplica la siguiente configuracion por defecto:

```
Access-Control-Allow-Origin:  *
Access-Control-Allow-Methods: GET, HEAD, PUT, PATCH, POST, DELETE
Access-Control-Allow-Headers: Content-Type, Accept
```

### 2.2 Configuracion avanzada de CORS

En entornos de produccion, se recomienda configurar CORS con opciones precisas para limitar los origenes, metodos y cabeceras permitidos:

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // Origenes autorizados (puede ser un string, un array o una funcion)
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],

    // Metodos HTTP permitidos
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Cabeceras que el cliente puede enviar
    allowedHeaders: ['Content-Type', 'Authorization'],

    // Permite el envio de credenciales (cookies, tokens de sesion)
    credentials: false,

    // Tiempo en segundos que el preflight puede ser cacheado por el navegador
    maxAge: 3600,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('API corriendo en http://localhost:3000');
}
bootstrap();
```

### 2.3 Configuracion de CORS segun el entorno

En proyectos reales, los origenes permitidos suelen variar entre desarrollo y produccion. Se recomienda gestionarlos a traves de variables de entorno:

```env
# .env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<contrasena>@cluster0.xxxxx.mongodb.net/ejemplo
CORS_ORIGIN=http://localhost:5500
```

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigin = process.env.CORS_ORIGIN ?? '*';

  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('API corriendo en http://localhost:3000');
}
bootstrap();
```

### 2.4 Verificar que CORS esta funcionando

Una vez levantada la API con `npm run start:dev`, se puede verificar la presencia de las cabeceras CORS con `curl`:

```bash
curl -I -X OPTIONS http://localhost:3000/estudiantes \
  -H "Origin: http://localhost:5500" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

La respuesta deberia incluir cabeceras similares a:

```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:5500
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## 3. Creacion de una pagina HTML que consume la API

En esta seccion se construye una pagina web estatica, completamente independiente del proyecto NestJS, que se comunica con la API a traves de solicitudes HTTP usando la API `fetch` de JavaScript.

### 3.1 Estructura del proyecto del cliente

Este es un proyecto separado del backend. Puede ubicarse en cualquier directorio del sistema de archivos o del Codespace:

```
cliente-estudiantes/
└── index.html
```

No requiere dependencias ni instalaciones adicionales. Toda la logica se escribe en HTML y JavaScript nativo dentro de un unico archivo.

### 3.2 Diagrama de la comunicacion cliente-servidor

```
                     PAGINA WEB (cliente)
                   index.html (puerto 5500)
                          |
                          | fetch() con JSON
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
     POST /estudiantes  GET /estudiantes  GET /estudiantes/:id
          |               |               |
          v               v               v
                  API NestJS (puerto 3000)
                  EstudiantesController
                          |
                          v
                  EstudiantesService
                          |
                          v
                       MongoDB
```

### 3.3 Paso a paso: construccion del archivo `index.html`

El archivo se construye en cuatro partes: estructura HTML, estilos CSS basicos, formulario de insercion, y logica JavaScript para cada operacion.

#### Paso 1: Definir la estructura base del documento HTML

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gestion de Estudiantes</title>
</head>
<body>

  <h1>Gestion de Estudiantes</h1>
  <p>Esta pagina consume la API REST construida con NestJS.</p>

  <!-- Aqui se agregan las secciones en los pasos siguientes -->

</body>
</html>
```

#### Paso 2: Agregar estilos CSS basicos

Dentro de la etiqueta `<head>`, despues del titulo, se agrega un bloque `<style>`:

```html
<style>
  body {
    font-family: Arial, sans-serif;
    max-width: 700px;
    margin: 40px auto;
    padding: 0 20px;
    color: #333;
  }

  h1, h2 {
    border-bottom: 1px solid #ccc;
    padding-bottom: 8px;
  }

  label {
    display: block;
    margin-top: 12px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    box-sizing: border-box;
  }

  button {
    margin-top: 14px;
    padding: 9px 18px;
    background-color: #2c6fad;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
  }

  button:hover {
    background-color: #1a4f80;
  }

  pre {
    background-color: #f4f4f4;
    padding: 14px;
    overflow-x: auto;
    border-left: 4px solid #2c6fad;
    font-size: 13px;
  }

  .seccion {
    margin-top: 36px;
  }
</style>
```

#### Paso 3: Agregar el formulario para insertar un estudiante (POST)

Dentro del `<body>`, agregar la siguiente seccion:

```html
<div class="seccion">
  <h2>Insertar estudiante</h2>

  <label for="nombre">Nombre:</label>
  <input type="text" id="nombre" placeholder="Nombre completo del estudiante">

  <label for="codigo">Codigo:</label>
  <input type="number" id="codigo" placeholder="Codigo numerico">

  <button onclick="insertarEstudiante()">Insertar</button>

  <h3>Respuesta del servidor:</h3>
  <pre id="respuestaPost">Aun no se ha realizado ninguna solicitud.</pre>
</div>
```

#### Paso 4: Agregar los botones para consultar estudiantes (GET)

```html
<div class="seccion">
  <h2>Consultar todos los estudiantes</h2>
  <button onclick="consultarTodos()">Obtener lista completa</button>

  <h3>Respuesta del servidor:</h3>
  <pre id="respuestaGetTodos">Aun no se ha realizado ninguna solicitud.</pre>
</div>

<div class="seccion">
  <h2>Consultar estudiante por ID</h2>

  <label for="idBusqueda">ID del estudiante:</label>
  <input type="text" id="idBusqueda" placeholder="Pega aqui el _id devuelto por la API">

  <button onclick="consultarPorId()">Buscar</button>

  <h3>Respuesta del servidor:</h3>
  <pre id="respuestaGetUno">Aun no se ha realizado ninguna solicitud.</pre>
</div>
```

#### Paso 5: Agregar la logica JavaScript

Antes del cierre de `</body>`, agregar el bloque `<script>`:

```html
<script>
  // URL base de la API. Cambiar si la API esta en otro host o puerto.
  const API_URL = 'http://localhost:3000';

  // ── POST: Insertar un nuevo estudiante ────────────────────────
  async function insertarEstudiante() {
    const nombre = document.getElementById('nombre').value.trim();
    const codigo = parseInt(document.getElementById('codigo').value);

    // Validacion basica en el cliente antes de enviar la solicitud
    if (!nombre || isNaN(codigo)) {
      document.getElementById('respuestaPost').textContent =
        'Error: complete todos los campos correctamente.';
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/estudiantes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, codigo })
      });

      const datos = await respuesta.json();
      document.getElementById('respuestaPost').textContent =
        JSON.stringify(datos, null, 2);

    } catch (error) {
      document.getElementById('respuestaPost').textContent =
        'Error de red: ' + error.message;
    }
  }

  // ── GET: Consultar todos los estudiantes ──────────────────────
  async function consultarTodos() {
    try {
      const respuesta = await fetch(`${API_URL}/estudiantes`);
      const datos = await respuesta.json();
      document.getElementById('respuestaGetTodos').textContent =
        JSON.stringify(datos, null, 2);

    } catch (error) {
      document.getElementById('respuestaGetTodos').textContent =
        'Error de red: ' + error.message;
    }
  }

  // ── GET: Consultar un estudiante por su _id ───────────────────
  async function consultarPorId() {
    const id = document.getElementById('idBusqueda').value.trim();

    if (!id) {
      document.getElementById('respuestaGetUno').textContent =
        'Error: ingrese un ID valido.';
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/estudiantes/${id}`);
      const datos = await respuesta.json();
      document.getElementById('respuestaGetUno').textContent =
        JSON.stringify(datos, null, 2);

    } catch (error) {
      document.getElementById('respuestaGetUno').textContent =
        'Error de red: ' + error.message;
    }
  }
</script>
```

### 3.4 Archivo `index.html` completo

A continuacion se presenta el archivo unificado con todas las secciones anteriores integradas:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gestion de Estudiantes</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 700px;
      margin: 40px auto;
      padding: 0 20px;
      color: #333;
    }
    h1, h2 { border-bottom: 1px solid #ccc; padding-bottom: 8px; }
    label { display: block; margin-top: 12px; font-weight: bold; }
    input { width: 100%; padding: 8px; margin-top: 4px; box-sizing: border-box; }
    button {
      margin-top: 14px; padding: 9px 18px;
      background-color: #2c6fad; color: white;
      border: none; cursor: pointer; font-size: 14px;
    }
    button:hover { background-color: #1a4f80; }
    pre {
      background-color: #f4f4f4; padding: 14px;
      overflow-x: auto; border-left: 4px solid #2c6fad; font-size: 13px;
    }
    .seccion { margin-top: 36px; }
  </style>
</head>
<body>

  <h1>Gestion de Estudiantes</h1>
  <p>Esta pagina consume la API REST construida con NestJS.</p>

  <!-- INSERTAR -->
  <div class="seccion">
    <h2>Insertar estudiante</h2>
    <label for="nombre">Nombre:</label>
    <input type="text" id="nombre" placeholder="Nombre completo del estudiante">
    <label for="codigo">Codigo:</label>
    <input type="number" id="codigo" placeholder="Codigo numerico">
    <button onclick="insertarEstudiante()">Insertar</button>
    <h3>Respuesta del servidor:</h3>
    <pre id="respuestaPost">Aun no se ha realizado ninguna solicitud.</pre>
  </div>

  <!-- CONSULTAR TODOS -->
  <div class="seccion">
    <h2>Consultar todos los estudiantes</h2>
    <button onclick="consultarTodos()">Obtener lista completa</button>
    <h3>Respuesta del servidor:</h3>
    <pre id="respuestaGetTodos">Aun no se ha realizado ninguna solicitud.</pre>
  </div>

  <!-- CONSULTAR POR ID -->
  <div class="seccion">
    <h2>Consultar estudiante por ID</h2>
    <label for="idBusqueda">ID del estudiante:</label>
    <input type="text" id="idBusqueda" placeholder="Pega aqui el _id devuelto por la API">
    <button onclick="consultarPorId()">Buscar</button>
    <h3>Respuesta del servidor:</h3>
    <pre id="respuestaGetUno">Aun no se ha realizado ninguna solicitud.</pre>
  </div>

  <script>
    const API_URL = 'http://localhost:3000';

    async function insertarEstudiante() {
      const nombre = document.getElementById('nombre').value.trim();
      const codigo = parseInt(document.getElementById('codigo').value);
      if (!nombre || isNaN(codigo)) {
        document.getElementById('respuestaPost').textContent =
          'Error: complete todos los campos correctamente.';
        return;
      }
      try {
        const respuesta = await fetch(`${API_URL}/estudiantes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, codigo })
        });
        const datos = await respuesta.json();
        document.getElementById('respuestaPost').textContent =
          JSON.stringify(datos, null, 2);
      } catch (error) {
        document.getElementById('respuestaPost').textContent =
          'Error de red: ' + error.message;
      }
    }

    async function consultarTodos() {
      try {
        const respuesta = await fetch(`${API_URL}/estudiantes`);
        const datos = await respuesta.json();
        document.getElementById('respuestaGetTodos').textContent =
          JSON.stringify(datos, null, 2);
      } catch (error) {
        document.getElementById('respuestaGetTodos').textContent =
          'Error de red: ' + error.message;
      }
    }

    async function consultarPorId() {
      const id = document.getElementById('idBusqueda').value.trim();
      if (!id) {
        document.getElementById('respuestaGetUno').textContent =
          'Error: ingrese un ID valido.';
        return;
      }
      try {
        const respuesta = await fetch(`${API_URL}/estudiantes/${id}`);
        const datos = await respuesta.json();
        document.getElementById('respuestaGetUno').textContent =
          JSON.stringify(datos, null, 2);
      } catch (error) {
        document.getElementById('respuestaGetUno').textContent =
          'Error de red: ' + error.message;
      }
    }
  </script>

</body>
</html>
```

### 3.5 Servir la pagina HTML en el Codespace

Una pagina HTML estatica no se puede abrir simplemente haciendo doble clic en el archivo dentro de un Codespace, ya que el navegador la abriria con el protocolo `file://`, lo cual genera restricciones adicionales. Es necesario servirla desde un servidor HTTP local.

#### Opcion A: Usando la extension Live Server de VS Code

1. En el Codespace, abrir la paleta de extensiones (`Ctrl+Shift+X`).
2. Buscar e instalar **Live Server** (autor: Ritwick Dey).
3. Hacer clic derecho sobre `index.html` y seleccionar **Open with Live Server**.
4. El Codespace habilitara un puerto publico (normalmente `5500`) y abrira la pagina en el navegador.

#### Opcion B: Usando un servidor HTTP de Python

```bash
# Desde el directorio del proyecto cliente
python3 -m http.server 5500
```

La pagina estara disponible en `http://localhost:5500`.

#### Opcion C: Usando npx serve

```bash
# Instalar y ejecutar en una sola linea
npx serve . -p 5500
```

### 3.6 Resumen del flujo de una solicitud desde el cliente HTML

```
Usuario completa el formulario y hace clic en "Insertar"
                          |
                          v
         JavaScript ejecuta insertarEstudiante()
                          |
                          v
         fetch() construye una solicitud HTTP:
         POST http://localhost:3000/estudiantes
         Content-Type: application/json
         Body: { "nombre": "...", "codigo": ... }
                          |
                          v
         El navegador detecta origen cruzado (puerto diferente)
         y envia automaticamente un preflight OPTIONS
                          |
                          v
         NestJS responde al preflight con cabeceras CORS
                          |
                          v
         El navegador envia la solicitud POST real
                          |
                          v
         EstudiantesController recibe la solicitud
         --> EstudiantesService --> MongoDB
                          |
                          v
         NestJS responde con 201 Created y el documento insertado
                          |
                          v
         JavaScript recibe la respuesta y muestra el JSON
         formateado en el elemento <pre> correspondiente
```

### 3.7 Errores comunes y como resolverlos

| Error                                         | Causa probable                                      | Solucion                                                         |
|-----------------------------------------------|-----------------------------------------------------|------------------------------------------------------------------|
| `CORS error` en la consola del navegador       | CORS no esta habilitado en NestJS                   | Verificar que `app.enableCors()` esta en `main.ts`               |
| `net::ERR_CONNECTION_REFUSED`                 | La API NestJS no esta en ejecucion                  | Ejecutar `npm run start:dev` en el proyecto backend              |
| `404 Not Found` al consultar por ID           | El ID ingresado no existe en la base de datos       | Copiar el `_id` exacto devuelto por el POST                      |
| La pagina no se actualiza al insertar         | El navegador puede estar cacheando la solicitud GET | Presionar `Ctrl+Shift+R` para recargar sin cache                 |
| `400 Bad Request` al insertar                 | El cuerpo de la solicitud no cumple el esquema      | Verificar que `nombre` sea texto y `codigo` sea un numero entero |

---

## Referencias Bibliograficas

1. **MDN Web Docs** (2024). *Cross-Origin Resource Sharing (CORS)*. Mozilla Developer Network. Recuperado de [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

2. **MDN Web Docs** (2024). *Same-origin policy*. Mozilla Developer Network. Recuperado de [https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)

3. **NestJS Documentation** (2024). *Security: CORS*. Recuperado de [https://docs.nestjs.com/security/cors](https://docs.nestjs.com/security/cors)

4. **MDN Web Docs** (2024). *Fetch API*. Mozilla Developer Network. Recuperado de [https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

5. **W3C** (2020). *Fetch Living Standard: CORS protocol*. WHATWG. Recuperado de [https://fetch.spec.whatwg.org/#http-cors-protocol](https://fetch.spec.whatwg.org/#http-cors-protocol)

6. **MDN Web Docs** (2024). *HTTP response status codes*. Mozilla. Recuperado de [https://developer.mozilla.org/en-US/docs/Web/HTTP/Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

7. **Ritwick Dey** (2024). *Live Server - VS Code Extension*. Recuperado de [https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

8. **NestJS Documentation** (2024). *NestJS - A progressive Node.js framework*. Recuperado de [https://docs.nestjs.com](https://docs.nestjs.com)

---

> **Extension sugerida:** Para completar el CRUD completo desde el cliente HTML, se pueden agregar secciones analogas para las operaciones de actualizacion (`PUT`/`PATCH`) usando `fetch()` con el metodo correspondiente y el ID del estudiante en la URL, y para eliminacion (`DELETE`) con `fetch(\`${API_URL}/estudiantes/${id}\`, { method: 'DELETE' })`.

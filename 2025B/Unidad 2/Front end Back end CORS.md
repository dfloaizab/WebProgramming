# PROGRAMACIÓN WEB, 2025 B
# UNIVERSIDAD SANTIAGO DE CALI
## Configuración de CORS en una API REST desarrollada con NestJS

### Introducción

El presente instructivo tiene como propósito explicar el procedimiento para configurar el mecanismo de **CORS (Cross-Origin Resource Sharing)** en una API REST implementada con el framework **NestJS**, de modo que pueda ser consumida por una aplicación cliente sencilla, como un formulario HTML. Se abordarán los conceptos básicos, su relevancia en el desarrollo web y los pasos detallados para su correcta implementación.

### Objetivos

1. Comprender el concepto de CORS y su función dentro de la arquitectura cliente-servidor.
2. Explicar la importancia de permitir o restringir solicitudes entre distintos orígenes.
3. Implementar la configuración de CORS en un proyecto NestJS.
4. Consumir la API desde un formulario HTML mediante los métodos HTTP GET y POST.

### Descripción de los conceptos

**CORS (Cross-Origin Resource Sharing)** es un mecanismo de seguridad implementado por los navegadores que restringe las solicitudes HTTP realizadas desde un origen distinto al del servidor que expone los recursos.  
Un “origen” está definido por la combinación de protocolo, dominio y puerto.  
Por ejemplo, una aplicación que se ejecuta en `http://localhost:3000` no puede, por defecto, realizar peticiones a un servidor en `http://localhost:4000` sin que este último habilite explícitamente el intercambio de recursos entre orígenes.

La configuración de CORS resulta esencial para garantizar la integridad y seguridad de las aplicaciones web modernas, evitando accesos no autorizados, robo de datos o ataques de tipo CSRF (Cross-Site Request Forgery).

### Importancia de la configuración de CORS

El correcto manejo de CORS permite que:
- Las aplicaciones cliente (por ejemplo, formularios web) puedan comunicarse con APIs externas sin restricciones indebidas.
- Se mantenga la seguridad al limitar qué dominios pueden acceder a los recursos de la API.
- Se eviten errores comunes en las solicitudes, tales como “No 'Access-Control-Allow-Origin' header is present on the requested resource”.

### Configuración paso a paso en NestJS

1. **Creación del proyecto NestJS**

   Crear un nuevo proyecto con el siguiente comando:

   ```bash
   npm i -g @nestjs/cli
   nest new api-cors
   ```

   Acceder al directorio del proyecto:
   ```bash
   cd api-cors
   ```

2. **Habilitación de CORS**

   NestJS permite configurar CORS directamente en el archivo `main.ts`.  
   Abrir dicho archivo y agregar la configuración básica antes de iniciar la aplicación.

   ```typescript
   import { NestFactory } from '@nestjs/core';
   import { AppModule } from './app.module';

   async function bootstrap() {
     const app = await NestFactory.create(AppModule);

     app.enableCors({
       origin: 'http://localhost:5500', // dominio del cliente permitido
       methods: ['GET', 'POST'],
       allowedHeaders: ['Content-Type'],
     });

     await app.listen(3000);
   }
   bootstrap();
   ```

   En este ejemplo, se permite el acceso desde un cliente alojado en `http://localhost:5500` (por ejemplo, un formulario HTML servido localmente).

3. **Creación de un controlador simple**

   Crear un controlador con los métodos GET y POST que recibirán las solicitudes desde el formulario.

   ```typescript
   import { Controller, Get, Post, Body } from '@nestjs/common';

   @Controller('datos')
   export class DatosController {
     @Get()
     obtenerDatos() {
       return { mensaje: 'Solicitud GET recibida correctamente' };
     }

     @Post()
     recibirDatos(@Body() datos: any) {
       return { mensaje: 'Solicitud POST procesada', datosRecibidos: datos };
     }
   }
   ```

   Registrar el controlador en el módulo principal `app.module.ts`:

   ```typescript
   import { Module } from '@nestjs/common';
   import { DatosController } from './datos.controller';

   @Module({
     controllers: [DatosController],
   })
   export class AppModule {}
   ```

4. **Ejecución del servidor**

   Iniciar la aplicación con:

   ```bash
   npm run start
   ```

   El servidor quedará disponible en `http://localhost:3000`.

### Consumo de la API desde un formulario HTML

A continuación se presenta un ejemplo básico de formulario que realiza solicitudes GET y POST a la API mediante JavaScript utilizando la API Fetch.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Formulario de prueba</title>
</head>
<body>
  <h2>Formulario de prueba con CORS</h2>

  <button id="btnGet">Enviar GET</button>

  <form id="formulario">
    <input type="text" name="nombre" placeholder="Nombre" required>
    <input type="email" name="correo" placeholder="Correo" required>
    <button type="submit">Enviar POST</button>
  </form>

  <pre id="resultado"></pre>

  <script>
    const apiUrl = 'http://localhost:3000/datos';
    const resultado = document.getElementById('resultado');

    document.getElementById('btnGet').addEventListener('click', async () => {
      const response = await fetch(apiUrl);
      const data = await response.json();
      resultado.textContent = JSON.stringify(data, null, 2);
    });

    document.getElementById('formulario').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const datos = Object.fromEntries(formData.entries());
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const data = await response.json();
      resultado.textContent = JSON.stringify(data, null, 2);
    });
  </script>
</body>
</html>
```

Al ejecutar este formulario desde un origen diferente al de la API (por ejemplo, desde un archivo local o un servidor simple), el intercambio de datos será posible gracias a la configuración de CORS realizada en el servidor NestJS.

### Conclusiones

La habilitación y configuración de CORS es un paso fundamental en el desarrollo de aplicaciones web modernas. Permite mantener un equilibrio entre accesibilidad y seguridad, asegurando que solo los orígenes autorizados puedan interactuar con los recursos de la API. NestJS facilita esta tarea mediante su método nativo `enableCors()`, lo que permite integrar el control de acceso de manera sencilla, precisa y segura.

# Programación Web - Universidad Santiago de Cali - 2026
#  CRUD con NestJS y MongoDB en GitHub Codespace

> **Guía paso a paso** para construir una API REST con NestJS conectada a MongoDB, con operaciones CRUD sobre una colección de estudiantes.

---

##  Tabla de Contenidos

1. [Creación del Modelo de Datos en MongoDB](#1-creación-del-modelo-de-datos-en-mongodb)
2. [Qué es una API REST y cómo estructurarla en NestJS](#2-qué-es-una-api-rest-y-cómo-estructurarla-en-nestjs)
3. [Creación del CRUD en NestJS](#3-creación-del-crud-en-nestjs)
4. [Referencias Bibliográficas](#referencias-bibliográficas)

---

## 1. Creación del Modelo de Datos en MongoDB

### 1.1 Conceptos previos

MongoDB es una base de datos **NoSQL orientada a documentos**. En lugar de tablas y filas (como en SQL), organiza la información en **colecciones** de **documentos** con formato similar a JSON (denominado BSON).

```
Base de datos relacional  →  MongoDB
─────────────────────────────────────
Base de datos            →  Database
Tabla                    →  Collection
Fila / Registro          →  Document
Columna                  →  Field (campo)
```

### 1.2 Diagrama de la estructura de datos

```
┌──────────────────────────────────────────────┐
│           BASE DE DATOS: ejemplo             │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │       COLECCIÓN: estudiantes           │  │
│  │                                        │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Documento 1                     │  │  │
│  │  │  {                               │  │  │
│  │  │    _id: ObjectId("..."),         │  │  │
│  │  │    nombre: "Ana García",         │  │  │
│  │  │    código: 1001                  │  │  │
│  │  │  }                               │  │  │
│  │  └──────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Documento 2                     │  │  │
│  │  │  {                               │  │  │
│  │  │    _id: ObjectId("..."),         │  │  │
│  │  │    nombre: "Carlos López",       │  │  │
│  │  │    código: 1002                  │  │  │
│  │  │  }                               │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### 1.3 Tipos de datos usados

| Campo    | Tipo MongoDB | Descripción                                  |
|----------|-------------|----------------------------------------------|
| `_id`    | `ObjectId`  | Identificador único generado automáticamente |
| `nombre` | `String`    | Nombre completo del estudiante               |
| `código` | `Number`    | Código numérico de identificación            |

### 1.4 Configurar MongoDB en GitHub Codespace

#### Opción A: MongoDB Atlas (recomendado, en la nube)

1. Ir a [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) y crear una cuenta gratuita.
2. Crear un **clúster gratuito (M0)**.
3. En **Database Access**, crear un usuario con contraseña.
4. En **Network Access**, agregar `0.0.0.0/0` para permitir acceso desde el Codespace.
5. Obtener la cadena de conexión (**Connection String**):
   ```
   mongodb+srv://<usuario>:<contraseña>@cluster0.xxxxx.mongodb.net/ejemplo
   ```

#### Opción B: MongoDB local en el Codespace

```bash
# Instalar MongoDB en el Codespace (Ubuntu)
sudo apt-get update
sudo apt-get install -y mongodb
sudo service mongodb start

# Verificar que está corriendo
sudo service mongodb status

# Conectar con mongo shell
mongosh
```

Una vez dentro del shell de MongoDB:

```javascript
// Seleccionar (o crear) la base de datos "ejemplo"
use ejemplo

// Verificar la base de datos activa
db

// Crear la colección "estudiantes" con un documento inicial
db.estudiantes.insertOne({
  nombre: "Ana García",
  código: 1001
})

// Consultar todos los documentos
db.estudiantes.find().pretty()

// Crear un índice único sobre el campo "código"
db.estudiantes.createIndex({ código: 1 }, { unique: true })
```

### 1.5 Esquema del documento (validación en MongoDB)

Aunque MongoDB es flexible, se puede definir validación de esquema:

```javascript
db.createCollection("estudiantes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "código"],
      properties: {
        nombre: {
          bsonType: "string",
          description: "Debe ser una cadena de texto. Campo requerido."
        },
        código: {
          bsonType: "int",
          description: "Debe ser un número entero. Campo requerido."
        }
      }
    }
  }
})
```

---

## 2. Qué es una API REST y cómo estructurarla en NestJS

### 2.1 Fundamentos de una API REST

Una **API REST** (*Representational State Transfer*) es un estilo de arquitectura para construir servicios web que permite la comunicación entre sistemas a través del protocolo **HTTP**.

#### Principios REST

```
┌─────────────────────────────────────────────────────────┐
│                  PRINCIPIOS REST                        │
│                                                         │
│  1. CLIENTE-SERVIDOR   → Separación de responsabilidades│
│  2. SIN ESTADO         → Cada petición es independiente │
│  3. CACHEABLE          → Respuestas pueden cachearse    │
│  4. INTERFAZ UNIFORME  → Uso consistente de HTTP        │
│  5. SISTEMA EN CAPAS   → Arquitectura por capas        │
└─────────────────────────────────────────────────────────┘
```

#### Verbos HTTP y operaciones CRUD

| Verbo HTTP | Operación CRUD | Descripción                  | Ejemplo de ruta         |
|-----------|---------------|------------------------------|------------------------|
| `GET`     | **Read**      | Obtener recursos             | `GET /estudiantes`     |
| `POST`    | **Create**    | Crear un nuevo recurso       | `POST /estudiantes`    |
| `PUT`     | **Update**    | Actualizar un recurso completo| `PUT /estudiantes/:id` |
| `PATCH`   | **Update**    | Actualizar parcialmente      | `PATCH /estudiantes/:id`|
| `DELETE`  | **Delete**    | Eliminar un recurso          | `DELETE /estudiantes/:id`|

#### Códigos de estado HTTP más comunes

| Código | Significado              |
|--------|--------------------------|
| `200`  | OK - Éxito               |
| `201`  | Created - Recurso creado |
| `400`  | Bad Request - Error del cliente |
| `404`  | Not Found - No encontrado |
| `500`  | Internal Server Error    |

### 2.2 Flujo de una petición REST

```
Cliente (Postman / Frontend / App)
         │
         │  HTTP Request (GET /estudiantes)
         ▼
┌─────────────────────────────────────────┐
│              NestJS API                 │
│                                         │
│  ┌──────────┐    ┌───────────┐          │
│  │Controller│───▶│  Service  │          │
│  │ (Rutas)  │◀───│ (Lógica)  │          │
│  └──────────┘    └─────┬─────┘          │
│                        │                │
│                        ▼                │
│               ┌──────────────┐          │
│               │  Repository  │          │
│               │  (Mongoose)  │          │
│               └──────┬───────┘          │
└──────────────────────┼──────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │     MongoDB      │
              │  DB: ejemplo     │
              │  Col: estudiantes│
              └──────────────────┘
```

### 2.3 NestJS: estructura y conceptos clave

**NestJS** es un framework progresivo de Node.js para construir aplicaciones del lado del servidor, escrito en **TypeScript**. Se inspira en la arquitectura de Angular.

#### Estructura de un proyecto NestJS

```
mi-proyecto/
├── src/
│   ├── app.module.ts          ← Módulo raíz
│   ├── main.ts                ← Punto de entrada
│   └── estudiantes/           ← Módulo de estudiantes
│       ├── estudiantes.module.ts
│       ├── estudiantes.controller.ts
│       ├── estudiantes.service.ts
│       ├── schemas/
│       │   └── estudiante.schema.ts
│       └── dto/
│           ├── create-estudiante.dto.ts
│           └── update-estudiante.dto.ts
├── .env                       ← Variables de entorno
├── package.json
└── tsconfig.json
```

#### Componentes principales

```
┌─────────────────────────────────────────────────────────┐
│                  ARQUITECTURA NESTJS                    │
│                                                         │
│  MODULE → Agrupa los componentes relacionados           │
│    │                                                    │
│    ├── CONTROLLER → Recibe peticiones HTTP y           │
│    │                define las rutas (@Get, @Post...)  │
│    │                                                    │
│    ├── SERVICE → Contiene la lógica de negocio         │
│    │             Inyectable (@Injectable)               │
│    │                                                    │
│    ├── SCHEMA → Define la estructura del documento     │
│    │            MongoDB (con Mongoose)                  │
│    │                                                    │
│    └── DTO → Data Transfer Object: valida los datos    │
│              de entrada del cliente                     │
└─────────────────────────────────────────────────────────┘
```

### 2.4 Preparar el entorno en GitHub Codespace

#### Paso 1: Crear el Codespace

1. Ir a tu repositorio en GitHub.
2. Clic en **Code → Codespaces → Create codespace on main**.
3. Esperar a que el entorno cargue.

#### Paso 2: Instalar Node.js y NestJS CLI

```bash
# Verificar versión de Node.js (debe ser >= 18)
node -v

# Instalar el CLI de NestJS globalmente
npm install -g @nestjs/cli

# Verificar instalación
nest --version
```

#### Paso 3: Crear el proyecto

```bash
# Crear nuevo proyecto NestJS
nest new crud-estudiantes

# Ingresar al directorio
cd crud-estudiantes

# Instalar dependencias de Mongoose y configuración
npm install @nestjs/mongoose mongoose
npm install @nestjs/config
```

#### Paso 4: Configurar variables de entorno

Crear el archivo `.env` en la raíz del proyecto:

```env
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.xxxxx.mongodb.net/ejemplo
PORT=3000
```

---

## 3. Creación del CRUD en NestJS

### 3.1 Diagrama del flujo completo

```
                    PETICIÓN HTTP
                         │
                         ▼
              ┌─────────────────────┐
              │    main.ts          │
              │  (Inicia el server) │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    app.module.ts    │
              │  (Módulo raíz)      │
              └──────────┬──────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │    EstudiantesModule          │
         │  (Registra todo el módulo)    │
         └──┬──────────────┬────────────┘
            │              │
            ▼              ▼
  ┌──────────────┐  ┌──────────────────┐
  │ Controller   │  │    Service       │
  │ /estudiantes │  │  (Lógica CRUD)   │
  └──────┬───────┘  └────────┬─────────┘
         │ inyecta           │ usa
         └────────┬──────────┘
                  ▼
        ┌──────────────────┐
        │  EstudianteSchema│
        │  (Mongoose Model) │
        └────────┬──────────┘
                 │
                 ▼
           [ MongoDB ]
```

### 3.2 Paso a paso: Crear los archivos

#### 3.2.1 Generar el módulo con NestJS CLI

```bash
# Generar módulo, controller y service automáticamente
nest generate module estudiantes
nest generate controller estudiantes
nest generate service estudiantes
```

#### 3.2.2 `src/estudiantes/schemas/estudiante.schema.ts` — El Esquema

El **Schema** define la estructura del documento en MongoDB usando Mongoose.

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Tipo del documento hidratado (con métodos de Mongoose)
export type EstudianteDocument = HydratedDocument<Estudiante>;

@Schema()
export class Estudiante {
  @Prop({ required: true, type: String })
  nombre: string;

  @Prop({ required: true, type: Number, unique: true })
  código: number;
}

export const EstudianteSchema = SchemaFactory.createForClass(Estudiante);
```

>  **¿Qué hace `@Schema()` y `@Prop()`?**
> - `@Schema()` marca la clase como un esquema de Mongoose.
> - `@Prop()` define cada campo del documento con sus validaciones.

#### 3.2.3 `src/estudiantes/dto/create-estudiante.dto.ts` — El DTO de Creación

El **DTO** (*Data Transfer Object*) valida los datos que llegan en el cuerpo de la petición HTTP.

```typescript
export class CreateEstudianteDto {
  nombre: string;
  código: number;
}
```

#### 3.2.4 `src/estudiantes/estudiantes.service.ts` — El Service

El **Service** contiene **toda la lógica de negocio** y la comunicación con la base de datos. El Controller nunca habla directamente con MongoDB; siempre lo hace a través del Service.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Estudiante, EstudianteDocument } from './schemas/estudiante.schema';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Injectable()
export class EstudiantesService {

  constructor(
    // Inyección del modelo de Mongoose para "Estudiante"
    @InjectModel(Estudiante.name)
    private estudianteModel: Model<EstudianteDocument>,
  ) {}

  // ── CREATE: Insertar un nuevo estudiante ──────────────────
  async crear(dto: CreateEstudianteDto): Promise<Estudiante> {
    const nuevoEstudiante = new this.estudianteModel(dto);
    return nuevoEstudiante.save(); // guarda en MongoDB
  }

  // ── READ: Consultar todos los estudiantes ─────────────────
  async obtenerTodos(): Promise<Estudiante[]> {
    return this.estudianteModel.find().exec();
  }

  // ── READ: Consultar un estudiante por su _id ──────────────
  async obtenerUno(id: string): Promise<Estudiante> {
    return this.estudianteModel.findById(id).exec();
  }
}
```

>  **¿Qué hace `@Injectable()`?**
> Permite que NestJS inyecte este servicio en otros componentes (como el Controller) automáticamente mediante **Inyección de Dependencias**.

#### 3.2.5 `src/estudiantes/estudiantes.controller.ts` — El Controller

El **Controller** es el punto de entrada HTTP. Define las **rutas** y los **verbos** (GET, POST, etc.), recibe las peticiones, llama al Service y devuelve la respuesta.

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Controller('estudiantes') // Prefijo de todas las rutas: /estudiantes
export class EstudiantesController {

  constructor(private readonly estudiantesService: EstudiantesService) {}

  // POST /estudiantes → Insertar un estudiante
  @Post()
  async crear(@Body() dto: CreateEstudianteDto) {
    return this.estudiantesService.crear(dto);
  }

  // GET /estudiantes → Consultar todos los estudiantes
  @Get()
  async obtenerTodos() {
    return this.estudiantesService.obtenerTodos();
  }

  // GET /estudiantes/:id → Consultar un estudiante por ID
  @Get(':id')
  async obtenerUno(@Param('id') id: string) {
    return this.estudiantesService.obtenerUno(id);
  }
}
```

#### 3.2.6 `src/estudiantes/estudiantes.module.ts` — El Module

El **Module** agrupa todos los componentes del dominio `estudiantes` y registra el esquema de Mongoose.

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstudiantesController } from './estudiantes.controller';
import { EstudiantesService } from './estudiantes.service';
import { Estudiante, EstudianteSchema } from './schemas/estudiante.schema';

@Module({
  imports: [
    // Registra el esquema para que Mongoose lo conozca
    MongooseModule.forFeature([
      { name: Estudiante.name, schema: EstudianteSchema }
    ]),
  ],
  controllers: [EstudiantesController],
  providers: [EstudiantesService],
})
export class EstudiantesModule {}
```

#### 3.2.7 `src/app.module.ts` — Módulo Raíz

Conecta la aplicación a MongoDB y carga el módulo de estudiantes.

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EstudiantesModule } from './estudiantes/estudiantes.module';

@Module({
  imports: [
    // Carga las variables de entorno del archivo .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a MongoDB usando la URI del archivo .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    EstudiantesModule,
  ],
})
export class AppModule {}
```

#### 3.2.8 `src/main.ts` — Punto de Entrada

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar CORS para desarrollo
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  console.log(` API corriendo en http://localhost:3000`);
}
bootstrap();
```

### 3.3 Archivo de estructura final del proyecto

```
crud-estudiantes/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   └── estudiantes/
│       ├── dto/
│       │   └── create-estudiante.dto.ts
│       ├── schemas/
│       │   └── estudiante.schema.ts
│       ├── estudiantes.controller.ts
│       ├── estudiantes.module.ts
│       └── estudiantes.service.ts
├── .env
├── package.json
└── tsconfig.json
```

### 3.4 Ejecutar la aplicación

```bash
# Modo desarrollo (recarga automática con cambios)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

Deberías ver en la terminal:
```
 API corriendo en http://localhost:3000
[Mongoose] Connected to MongoDB
```

### 3.5 Probar la API

#### Opción A: Usando `curl` en la terminal del Codespace

```bash
# ── Insertar un estudiante (POST) ────────────────────────────
curl -X POST http://localhost:3000/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Ana García", "código": 1001}'

# ── Insertar otro estudiante ─────────────────────────────────
curl -X POST http://localhost:3000/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Carlos López", "código": 1002}'

# ── Consultar todos los estudiantes (GET) ────────────────────
curl http://localhost:3000/estudiantes

# ── Consultar un estudiante por ID ──────────────────────────
curl http://localhost:3000/estudiantes/<_id_del_documento>
```

#### Opción B: Usando Postman

1. Descargar [Postman](https://www.postman.com/downloads/).
2. Crear una nueva colección llamada `Estudiantes CRUD`.
3. Agregar las siguientes peticiones:

| Petición          | Método | URL                                          | Body (JSON)                               |
|-------------------|--------|----------------------------------------------|-------------------------------------------|
| Crear estudiante  | POST   | `http://localhost:3000/estudiantes`           | `{"nombre": "Ana García", "código": 1001}`|
| Consultar todos   | GET    | `http://localhost:3000/estudiantes`           | —                                         |
| Consultar por ID  | GET    | `http://localhost:3000/estudiantes/:id`       | —                                         |

#### Respuesta esperada al insertar (POST)

```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "nombre": "Ana García",
  "código": 1001,
  "__v": 0
}
```

#### Respuesta esperada al consultar todos (GET)

```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "nombre": "Ana García",
    "código": 1001,
    "__v": 0
  },
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "nombre": "Carlos López",
    "código": 1002,
    "__v": 0
  }
]
```

### 3.6 Resumen del flujo de una petición POST

```
Cliente envía:
POST /estudiantes
{ "nombre": "Ana García", "código": 1001 }
        │
        ▼
EstudiantesController
  @Post() crear(@Body() dto)
        │  llama a...
        ▼
EstudiantesService
  crear(dto): guarda con Mongoose
        │
        ▼
MongoDB: db.estudiantes.insertOne({...})
        │
        ▼
Respuesta: 201 Created
{ "_id": "...", "nombre": "Ana García", "código": 1001 }
```

---

## Referencias Bibliográficas

1. **NestJS Documentation** (2024). *NestJS - A progressive Node.js framework*. Recuperado de [https://docs.nestjs.com](https://docs.nestjs.com)

2. **MongoDB, Inc.** (2024). *MongoDB Manual: Documents*. MongoDB Documentation. Recuperado de [https://www.mongodb.com/docs/manual/core/document/](https://www.mongodb.com/docs/manual/core/document/)

3. **Mongoose** (2024). *Mongoose v8 Documentation*. Recuperado de [https://mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html)

4. **Fielding, R. T.** (2000). *Architectural Styles and the Design of Network-based Software Architectures* (Doctoral dissertation). University of California, Irvine. Recuperado de [https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) *(Tesis doctoral original que define REST)*

5. **Richardson, L., & Ruby, S.** (2007). *RESTful Web Services*. O'Reilly Media.

6. **Kamińska, W.** (2023). *NestJS: The Complete Developer's Guide*. Udemy. Recuperado de [https://www.udemy.com/course/nestjs-the-complete-developers-guide/](https://www.udemy.com/course/nestjs-the-complete-developers-guide/)

7. **GitHub Docs** (2024). *GitHub Codespaces overview*. Recuperado de [https://docs.github.com/en/codespaces/overview](https://docs.github.com/en/codespaces/overview)

8. **MDN Web Docs** (2024). *HTTP response status codes*. Mozilla. Recuperado de [https://developer.mozilla.org/en-US/docs/Web/HTTP/Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

> **Tip:** Para extender este CRUD con las operaciones de actualización (`PUT`/`PATCH`) y eliminación (`DELETE`), sigue la misma lógica: agrega los métodos correspondientes en el Service (`actualizar`, `eliminar`) y decóralos en el Controller con `@Put(':id')` y `@Delete(':id')`.

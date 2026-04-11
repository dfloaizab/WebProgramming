# Programación 
# Fundamentos del Modelado de Bases de Datos Documentales

> Una introducción conceptual y práctica al diseño de esquemas en bases de datos NoSQL orientadas a documentos, con ejemplos en MongoDB.

---

## 📋 Tabla de Contenidos

1. [¿Qué es una base de datos documental?](#1-qué-es-una-base-de-datos-documental)
2. [Conceptos fundamentales](#2-conceptos-fundamentales)
3. [Comparación: Relacional vs. Documental](#3-comparación-relacional-vs-documental)
4. [Estrategias de modelado](#4-estrategias-de-modelado)
5. [Tipos de relaciones en bases de datos documentales](#5-tipos-de-relaciones-en-bases-de-datos-documentales)
6. [Patrones de diseño comunes](#6-patrones-de-diseño-comunes)
7. [Anti-patrones a evitar](#7-anti-patrones-a-evitar)
8. [Principios guía para el modelado](#8-principios-guía-para-el-modelado)
9. [Referencias Bibliográficas](#referencias-bibliográficas)

---

## 1. ¿Qué es una base de datos documental?

Una **base de datos documental** es un tipo de base de datos NoSQL que almacena la información en forma de **documentos semiestructurados**, generalmente en formato **JSON** o **BSON** (Binary JSON). Cada documento puede tener una estructura diferente, lo que le otorga una gran flexibilidad.

### Características principales

```
┌───────────────────────────────────────────────────────────┐
│          CARACTERÍSTICAS DE UNA BD DOCUMENTAL             │
│                                                           │
│  ✔ Documentos autocontenidos (toda la info en un lugar)  │
│  ✔ Esquema flexible (sin estructura fija obligatoria)    │
│  ✔ Soporta estructuras anidadas y arrays                 │
│  ✔ Alta escalabilidad horizontal (sharding)              │
│  ✔ Consultas ricas sobre el contenido del documento      │
│  ✔ Ideal para datos con estructura variable              │
└───────────────────────────────────────────────────────────┘
```

### Ejemplos de sistemas gestores documentales

| SGBD           | Empresa        | Formato   |
|----------------|---------------|-----------|
| **MongoDB**    | MongoDB, Inc. | BSON/JSON |
| **CouchDB**    | Apache        | JSON      |
| **Firestore**  | Google        | JSON      |
| **DynamoDB**   | Amazon        | JSON      |
| **RavenDB**    | Hibernating Rhinos | JSON |

---

## 2. Conceptos Fundamentales

### 2.1 Documento

La unidad básica de almacenamiento. Es un objeto similar a JSON con pares **clave-valor**.

```json
{
  "_id": "ObjectId('64f1a2b3c4d5e6f7a8b9c0d1')",
  "nombre": "Ana García",
  "código": 1001,
  "materias": ["Cálculo", "Física", "Programación"],
  "dirección": {
    "ciudad": "Cali",
    "barrio": "El Peñón"
  }
}
```

> Un documento puede contener:
> - Tipos primitivos: `String`, `Number`, `Boolean`, `Date`, `Null`
> - Arrays: listas de valores u objetos
> - Documentos embebidos: objetos dentro de objetos

### 2.2 Colección

Agrupación de documentos relacionados. Equivale a una tabla en SQL, pero **sin esquema fijo**.

```
COLECCIÓN: estudiantes
┌────────────────────────────────────────────────────┐
│  Doc 1: { nombre, código, materias: [...] }        │
│  Doc 2: { nombre, código }                         │  ← Diferente estructura
│  Doc 3: { nombre, código, gpa: 4.5, activo: true } │  ← También válido
└────────────────────────────────────────────────────┘
```

### 2.3 Base de datos

Contenedor lógico de colecciones.

```
base de datos: ejemplo
├── colección: estudiantes
├── colección: profesores
└── colección: cursos
```

### 2.4 Identificador `_id`

Cada documento tiene un campo `_id` **único** dentro de la colección. Por defecto, MongoDB genera un `ObjectId` automáticamente, aunque puede ser cualquier valor único.

```
ObjectId("64f1a2b3c4d5e6f7a8b9c0d1")
         │        │      │    │
         └ 4 bytes│      │    └─ 3 bytes aleatorios
           timestamp│    └─ 5 bytes aleatorios (proceso)
                    └─ 3 bytes contador
```

---

## 3. Comparación: Relacional vs. Documental

### Terminología equivalente

| Base de datos Relacional | Base de datos Documental |
|--------------------------|--------------------------|
| Base de datos            | Base de datos            |
| Tabla                    | Colección                |
| Fila / Registro          | Documento                |
| Columna / Atributo       | Campo (field)            |
| JOIN entre tablas        | Documento embebido o referencia |
| Esquema fijo             | Esquema flexible         |
| Transacciones ACID       | Consistencia eventual (por defecto) |
| Escalado vertical        | Escalado horizontal      |

### Diagrama comparativo

```
BASE DE DATOS RELACIONAL              BASE DE DATOS DOCUMENTAL
─────────────────────────             ────────────────────────

TABLA: estudiantes                    COLECCIÓN: estudiantes
┌────┬──────────┬────────┐            ┌─────────────────────────────┐
│ id │ nombre   │ código │            │ { _id: "...",               │
├────┼──────────┼────────┤            │   nombre: "Ana García",     │
│  1 │Ana García│  1001  │            │   código: 1001,             │
│  2 │Carlos L. │  1002  │            │   materias: ["Física"] }    │
└────┴──────────┴────────┘            ├─────────────────────────────┤
                                      │ { _id: "...",               │
TABLA: materias                       │   nombre: "Carlos López",   │
┌────┬──────────────┬─────────────┐   │   código: 1002 }            │
│ id │ nombre       │ estudiante_id│  └─────────────────────────────┘
├────┼──────────────┼─────────────┤
│  1 │ Física       │     1       │  ← En documental, las materias
│  2 │ Cálculo      │     1       │    pueden estar embebidas en el
└────┴──────────────┴─────────────┘    mismo documento del estudiante
```

### ¿Cuándo usar cada enfoque?

| Criterio                    | Relacional (SQL)         | Documental (NoSQL)              |
|-----------------------------|-------------------------|---------------------------------|
| Estructura de datos         | Fija y predefinida       | Variable y flexible             |
| Relaciones complejas        | ✅ Ideal (JOINs)         | ⚠️ Más complejo                 |
| Escala horizontal           | ⚠️ Limitado              | ✅ Natural (sharding)           |
| Velocidad de desarrollo     | ⚠️ Migraciones requeridas| ✅ Rápido (sin migraciones)     |
| Consistencia de datos       | ✅ ACID garantizado      | ⚠️ Configurable                 |
| Datos jerárquicos/anidados  | ⚠️ Requiere JOINs        | ✅ Embebido nativo              |
| Consultas analíticas        | ✅ SQL potente            | ⚠️ Agregaciones más complejas   |

---

## 4. Estrategias de Modelado

En bases de datos documentales existen dos estrategias principales para representar relaciones entre entidades:

### 4.1 Embedding (Documentos Embebidos)

Consiste en **incluir los datos relacionados dentro del mismo documento**.

```
┌──────────────────────────────────────────────────┐
│  DOCUMENTO: Estudiante con materias embebidas     │
│  {                                               │
│    "_id": "...",                                 │
│    "nombre": "Ana García",                       │
│    "código": 1001,                               │
│    "materias": [          ◄── Array embebido     │
│      {                                           │
│        "nombre": "Cálculo",                      │
│        "créditos": 4,                            │
│        "nota": 4.5                               │
│      },                                          │
│      {                                           │
│        "nombre": "Física",                       │
│        "créditos": 3,                            │
│        "nota": 3.8                               │
│      }                                           │
│    ]                                             │
│  }                                               │
└──────────────────────────────────────────────────┘
```

**✅ Ventajas del embedding:**
- Una sola operación de lectura obtiene todo.
- No se necesitan JOINs.
- Mejor rendimiento de lectura.

**⚠️ Desventajas:**
- Documentos grandes consumen más memoria.
- Duplicación de datos si la información es compartida.
- Límite de 16 MB por documento en MongoDB.

**📌 Úsalo cuando:**
- Los datos siempre se acceden juntos.
- La relación es de "uno a pocos" (one-to-few).
- Los datos embebidos solo pertenecen a ese documento.

### 4.2 Referencing (Referencias entre Documentos)

Consiste en **almacenar el `_id`** de un documento en otro, similar a una clave foránea.

```
COLECCIÓN: estudiantes          COLECCIÓN: cursos
┌─────────────────────┐         ┌─────────────────────┐
│ {                   │         │ {                   │
│   "_id": "est001",  │         │   "_id": "cur001",  │
│   "nombre": "Ana",  │         │   "nombre": "Cálculo"│
│   "cursos": [       │────────▶│   "créditos": 4     │
│     "cur001",       │         │ }                   │
│     "cur002"        │         └─────────────────────┘
│   ]                 │         ┌─────────────────────┐
│ }                   │         │ {                   │
└─────────────────────┘         │   "_id": "cur002",  │
                                │   "nombre": "Física" │
                                │   "créditos": 3     │
                                │ }                   │
                                └─────────────────────┘
```

**✅ Ventajas del referencing:**
- Evita duplicación de datos.
- Ideal para relaciones "muchos a muchos".
- Documentos más pequeños y manejables.

**⚠️ Desventajas:**
- Requiere múltiples consultas o uso de `$lookup` (equivalente al JOIN).
- Mayor latencia en lecturas complejas.

**📌 Úsalo cuando:**
- Los datos son compartidos entre múltiples documentos.
- La relación es "uno a muchos" o "muchos a muchos".
- Los datos relacionados crecen de forma ilimitada.

---

## 5. Tipos de Relaciones en Bases de Datos Documentales

### 5.1 Uno a uno (1:1)

```
Estudiante ──────── Expediente académico
    │                        │
    │ { _id, nombre }        │ { _id, estudianteId, historial }
    └────────────────────────┘
         referencia por _id
```

**Modelado recomendado:** Embedding (si siempre se consultan juntos) o referencia (si se consultan por separado).

### 5.2 Uno a pocos (1:few)

```
Estudiante ─────── Direcciones (2 o 3 max)
```
**Modelado recomendado:** **Embedding** ✅

```json
{
  "nombre": "Ana García",
  "direcciones": [
    { "tipo": "casa", "ciudad": "Cali" },
    { "tipo": "trabajo", "ciudad": "Palmira" }
  ]
}
```

### 5.3 Uno a muchos (1:N)

```
Profesor ─────── Estudiantes (cientos)
```
**Modelado recomendado:** **Referencing** ✅ (guardar el id del profesor en cada estudiante)

```json
// Colección: estudiantes
{
  "nombre": "Ana García",
  "profesor_id": "ObjectId('prof001')"  ← referencia
}
```

### 5.4 Muchos a muchos (N:M)

```
Estudiantes ─────── Cursos
(un estudiante toma varios cursos,
un curso tiene varios estudiantes)
```
**Modelado recomendado:** **Referencias en ambos lados** o **colección intermedia** ✅

```json
// Colección: estudiantes
{ "nombre": "Ana", "cursos_ids": ["cur001", "cur002"] }

// Colección: cursos
{ "nombre": "Cálculo", "estudiantes_ids": ["est001", "est003"] }
```

---

## 6. Patrones de Diseño Comunes

### 6.1 Patrón Subset (Subconjunto)

Embeber solo los datos más frecuentemente consultados y referenciar el resto.

```
┌─────────────────────────────────────┐
│ Producto (documento principal)      │
│ {                                   │
│   nombre: "Laptop",                 │
│   precio: 2500000,                  │
│   últimas_reseñas: [   ← solo 5   │
│     { usuario, texto, stars }       │
│   ]                                 │
│ }                                   │
└─────────────────────────────────────┘
                   +
┌─────────────────────────────────────┐
│ Colección: reseñas_completas        │
│ (todas las reseñas referenciadas)   │
└─────────────────────────────────────┘
```

### 6.2 Patrón Computed (Valor Pre-calculado)

Almacenar valores calculados para evitar cómputos costosos en cada consulta.

```json
{
  "nombre": "Ana García",
  "materias": ["Cálculo", "Física", "Programación"],
  "total_materias": 3,      ← Pre-calculado
  "promedio_gpa": 4.1        ← Pre-calculado
}
```

### 6.3 Patrón Bucket (Agrupación)

Agrupar documentos relacionados en un solo documento para reducir el número de documentos.

```json
// En lugar de un documento por medición...
{
  "sensor_id": "temp-001",
  "fecha": "2024-01-15",
  "mediciones": [           ← Un "balde" con todas las mediciones del día
    { "hora": "08:00", "valor": 22.3 },
    { "hora": "09:00", "valor": 23.1 },
    { "hora": "10:00", "valor": 24.5 }
  ],
  "count": 3
}
```

---

## 7. Anti-patrones a Evitar

### ❌ Arrays de crecimiento ilimitado

```json
// MAL: Si los comentarios crecen sin límite, el documento puede alcanzar 16 MB
{
  "post": "Título del artículo",
  "comentarios": [
    "comentario 1", "comentario 2", "... 10,000 comentarios más"
  ]
}
```
**✅ Solución:** Crear una colección separada de comentarios con referencia al post.

### ❌ Documentos masivos innecesarios

Embeber demasiados datos que podrían separarse, haciendo que cada documento sea enorme y lento de recuperar.

### ❌ Normalización excesiva

Fragmentar tanto los datos que cada consulta requiere múltiples `$lookup`, eliminando la ventaja de la BD documental.

### ❌ Ignorar los patrones de acceso

El modelo documental **se diseña desde las consultas**, no desde las entidades. Si no sabes cómo se van a consultar los datos, el diseño será ineficiente.

---

## 8. Principios Guía para el Modelado

```
┌─────────────────────────────────────────────────────────────────┐
│              REGLAS DE ORO DEL MODELADO DOCUMENTAL              │
│                                                                 │
│  1. DISEÑA DESDE LAS CONSULTAS                                  │
│     ¿Cómo se accede a los datos? Define eso primero.           │
│                                                                 │
│  2. DATOS QUE SE CONSULTAN JUNTOS, SE ALMACENAN JUNTOS          │
│     → Usa embedding                                             │
│                                                                 │
│  3. DATOS QUE CRECEN SIN LÍMITE, SE REFERENCIAN                │
│     → Usa referencing                                           │
│                                                                 │
│  4. FAVORECE LA DESNORMALIZACIÓN CUANDO MEJORA EL RENDIMIENTO   │
│     La duplicación controlada es aceptable en NoSQL.            │
│                                                                 │
│  5. EVITA LOS JOINS FRECUENTES                                  │
│     Cada $lookup es una penalización de rendimiento.            │
│                                                                 │
│  6. CONSIDERA EL TAMAÑO MÁXIMO DE 16 MB POR DOCUMENTO          │
│     Limita los arrays embebidos cuando pueden crecer mucho.     │
│                                                                 │
│  7. LOS ÍNDICES SON FUNDAMENTALES                               │
│     Crea índices sobre los campos que usas en filtros y ordenamiento│
└─────────────────────────────────────────────────────────────────┘
```

### Resumen de decisión embedding vs referencing

```
                  ¿Los datos se consultan siempre juntos?
                              │
               ┌──────────────┴──────────────┐
              SÍ                             NO
               │                             │
               ▼                             ▼
   ¿La entidad hija puede         ¿La entidad hija puede
   crecer sin límite?              ser compartida por
               │                  múltiples documentos?
     ┌─────────┴──────┐                    │
    NO               SÍ             ┌──────┴──────┐
     │               │             SÍ            NO
     ▼               ▼              │             │
 EMBEDDING      REFERENCING    REFERENCING   EMBEDDING
  ✅ Ideal       ✅ Mejor        ✅ Ideal       ✅ Mejor
```

---

## Referencias Bibliográficas

1. **Bradshaw, S., Brazil, E., & Chodorow, K.** (2019). *MongoDB: The Definitive Guide* (3rd ed.). O'Reilly Media.

2. **MongoDB, Inc.** (2024). *Data Modeling Introduction*. MongoDB Documentation. Recuperado de [https://www.mongodb.com/docs/manual/core/data-modeling-introduction/](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)

3. **MongoDB, Inc.** (2024). *Model One-to-Many Relationships with Embedded Documents*. Recuperado de [https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/](https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/)

4. **Fowler, M., & Sadalage, P.** (2012). *NoSQL Distilled: A Brief Guide to the Emerging World of Polyglot Persistence*. Addison-Wesley Professional.

5. **Copeland, R.** (2013). *MongoDB Applied Design Patterns*. O'Reilly Media.

6. **Kleppmann, M.** (2017). *Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems*. O'Reilly Media.

7. **MongoDB University** (2024). *M320: Data Modeling*. Curso en línea. Recuperado de [https://learn.mongodb.com/courses/m320-mongodb-data-modeling](https://learn.mongodb.com/courses/m320-mongodb-data-modeling)

8. **Antirez** (Salvatore Sanfilippo) & **Redis Labs** (2020). *When to Embed vs Reference in MongoDB*. Recuperado de [https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design)

---

> **Para profundizar:** MongoDB University ofrece el curso gratuito **M320: Data Modeling** que cubre todos estos patrones con ejercicios prácticos. Disponible en [https://university.mongodb.com](https://university.mongodb.com)

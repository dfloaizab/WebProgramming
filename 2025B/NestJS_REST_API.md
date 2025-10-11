# PROGRAMACIÓN WEB, 2025B

## Implementación de una API REST en NestJS con consulta de usuarios en MySQL/MariaDB y gestión de productos en MongoDB Atlas

Aquí se describe paso a paso y de forma completa la creación de una API REST con NestJS que realiza dos funciones principales: (1) consulta de usuario y contraseña almacenados en una tabla relacional (MySQL o MariaDB), sin cifrado (solo para fines de prueba/consulta); (2) consulta y adición de productos en MongoDB Atlas, donde cada producto contiene únicamente `codigo` y `nombre`. Se incluyen instrucciones de instalación, verificación, estructura del proyecto, módulos, controladores, servicios, DTOs, entidades y esquemas, ejemplos SQL para la tabla de usuarios y comandos `curl` para probar la API.

> Nota de seguridad: mantener contraseñas sin cifrar en producción es inseguro. El ejemplo solicitado no cifra contraseñas y debe usarse únicamente con fines educativos o en entornos controlados.

---

## 1. Requisitos e instalación inicial

### 1.1 Requisitos mínimos
- Node.js v18+ (recomendado).  
- NPM o Yarn.  
- Cuenta de MongoDB Atlas y una base de datos/clúster disponible.  
- Instancia de MySQL o MariaDB accesible (local o remota).

### 1.2 Verificación de Node.js y NPM
En la terminal, comprobar versiones:
```bash
node -v
npm -v
```
Debe informarse una versión apropiada de Node.js (por ejemplo `v18.x` o superior) y la versión de `npm`. Si no están instalados, instalar Node.js desde el sitio oficial.

### 1.3 Instalación del CLI de NestJS (opcional pero recomendado)
```bash
npm i -g @nestjs/cli
```
Verificar:
```bash
nest --version
```

### 1.4 Crear el proyecto NestJS
Crear un directorio y generar proyecto:
```bash
nest new proyecto-multi-db
```
Seleccionar `npm` o `yarn` según preferencia. Entrar al directorio:
```bash
cd proyecto-multi-db
```

### 1.5 Instalación de dependencias necesarias
Instalar las librerías para conectar MySQL/MariaDB (TypeORM) y MongoDB (Mongoose), y utilidades:
```bash
npm install --save @nestjs/typeorm typeorm mysql2
npm install --save @nestjs/mongoose mongoose
npm install --save class-validator class-transformer
```
Explicación breve:
- `@nestjs/typeorm`, `typeorm` y `mysql2`: conexión y ORM para MySQL/MariaDB.  
- `@nestjs/mongoose`, `mongoose`: integración con MongoDB/Mongo Atlas.  
- `class-validator`, `class-transformer`: validación de DTOs en controladores.

---

## 2. Estructura propuesta del proyecto (archivos principales)
Se mostrará un árbol reducido con los archivos que vamos a crear/modificar:
```
proyecto-multi-db/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  ├─ auth/
│  │  ├─ auth.module.ts
│  │  ├─ auth.controller.ts
│  │  ├─ auth.service.ts
│  │  └─ dto/check-credentials.dto.ts
│  ├─ users/
│  │  └─ entities/user.entity.ts
│  ├─ products/
│  │  ├─ products.module.ts
│  │  ├─ products.controller.ts
│  │  ├─ products.service.ts
│  │  ├─ dto/create-product.dto.ts
│  │  └─ schemas/product.schema.ts
│  └─ common/
│     └─ dto/pagination.dto.ts   (opcional)
├─ .env
├─ package.json
└─ tsconfig.json
```

---

## 3. Configuración de variables de entorno
Crear un archivo `.env` en la raíz con contenido de ejemplo (ajustar credenciales reales):

```
# MySQL / MariaDB
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=usuario_db
MYSQL_PASSWORD=mi_password
MYSQL_DATABASE=bd_usuarios

# MongoDB Atlas (cadena de conexión completa)
MONGODB_URI=mongodb+srv://usuarioAtlas:passwordAtlas@cluster0.mongodb.net/nombreDB?retryWrites=true&w=majority

# Puerto de la API
PORT=3000
```

Asegúrese de no incluir `.env` en repositorios públicos con credenciales reales.

---

## 4. Preparación de la tabla de usuarios (MySQL/MariaDB)

Ejemplo SQL para crear la base de datos y la tabla `users`:

```sql
CREATE DATABASE IF NOT EXISTS bd_usuarios;
USE bd_usuarios;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(200) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, fullname) VALUES
('juan', 'clave123', 'Juan Pérez'),
('maria', 'password', 'María Gómez');
```

---

## 5. Código: `main.ts`
```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API escuchando en http://localhost:${port}`);
}
bootstrap();
```

---

## 6. Código: `app.module.ts`
```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { User } from './users/entities/user.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: +(process.env.MYSQL_PORT || 3306),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'bd_usuarios',
      entities: [User],
      synchronize: false,
      logging: false,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || '', {}),
    AuthModule,
    ProductsModule,
  ],
})
export class AppModule {}
```

---

## 7. Entidad de usuario `src/users/entities/user.entity.ts`
```ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 200, nullable: true })
  fullname: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

---

## 8. Módulo de autenticación

### 8.1 DTO
```ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckCredentialsDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### 8.2 Módulo Auth
```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
```

### 8.3 Servicio Auth
```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async checkCredentials(username: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { username, password } });
    return user || null;
  }
}
```

### 8.4 Controlador Auth
```ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckCredentialsDto } from './dto/check-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check')
  @HttpCode(HttpStatus.OK)
  async check(@Body() dto: CheckCredentialsDto) {
    const user = await this.authService.checkCredentials(dto.username, dto.password);
    if (!user) {
      return { valid: false };
    }
    const { password, ...rest } = user as any;
    return { valid: true, user: rest };
  }
}
```

---

# 9. Módulo de productos

### 9.1 Esquema
```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products' })
export class Product {
  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ required: true })
  nombre: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

### 9.2 DTO
```ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;
}
```

### 9.3 Módulo Products
```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
```

### 9.4 Servicio Products
```ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().lean().exec();
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const created = new this.productModel(dto);
    return created.save();
  }
}
```

### 9.5 Controlador Products
```ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll() {
    const products = await this.productsService.findAll();
    return { count: products.length, data: products };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProductDto) {
    const product = await this.productsService.create(dto);
    return { created: true, product };
  }
}
```

---

## 10. Consideraciones sobre sincronización y migraciones
TypeORM con `synchronize: true` puede crear/actualizar tablas automáticamente durante desarrollo, pero no es seguro en producción. Mongoose creará la colección automáticamente si no existe.

---

## 11. Comandos para ejecutar la aplicación
```bash
npm install
npm run start:dev
```
O para producción:
```bash
npm run build
npm run start:prod
```

---

## 12. Pruebas de la API

### Verificar credenciales
```bash
curl -X POST http://localhost:3000/auth/check -H "Content-Type: application/json" -d '{"username":"juan","password":"clave123"}'
```

### Consultar productos
```bash
curl http://localhost:3000/products
```

### Agregar producto
```bash
curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"codigo":"P003","nombre":"Producto Nuevo"}'
```

---

## 13. Manejo de errores
Los DTOs usan `class-validator`. Si el cuerpo no tiene los campos requeridos, la petición retornará 400 con detalles.  
El esquema Mongoose define `unique: true`; se puede capturar errores duplicados en el servicio.

---

## 14. Resumen de endpoints
- `POST /auth/check` : Verifica `username` y `password` en MySQL.  
- `GET /products` : Lista todos los productos en MongoDB.  
- `POST /products` : Crea un producto en MongoDB.

---

## 15. Recomendaciones finales
1. No usar contraseñas en texto plano en producción.  
2. Implementar JWT u otros mecanismos de autenticación.  
3. Mantener `.env` fuera del control de versiones público.  
4. Usar migraciones en producción.  
5. Agregar filtros de excepción y CORS si se requiere.

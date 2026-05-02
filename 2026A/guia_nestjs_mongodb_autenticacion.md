# Universidad Santiago de Cali, Programación Web 2026A
# Guía: Autenticación con NestJS + MongoDB + Password Hash + Formulario HTML

## Objetivo

Implementar autenticación tradicional con:

- NestJS
- MongoDB
- Usuario y contraseña almacenados en base de datos
- Contraseña cifrada con bcrypt
- Formulario HTML sencillo
- Página de error para credenciales inválidas
- Sesión básica con JWT opcional

---

## 1. Crear proyecto

```bash
npm i -g @nestjs/cli
nest new nest-mongo-auth
cd nest-mongo-auth
npm install @nestjs/mongoose mongoose bcrypt
npm install @nestjs/jwt passport passport-jwt @nestjs/passport
npm install -D @types/bcrypt @types/passport-jwt
```

---

## 2. Estructura sugerida

```text
src/
 auth/
 users/
 app.module.ts
```

---

## 3. Conectar MongoDB

## app.module.ts

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
 imports: [
   MongooseModule.forRoot('mongodb://localhost:27017/authdb')
 ]
})
export class AppModule {}
```

---

## 4. Modelo Usuario

## users.schema.ts

```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
 @Prop({ unique: true })
 username: string;

 @Prop()
 password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

---

## 5. Crear usuario con contraseña cifrada

## users.service.ts

```ts
import * as bcrypt from 'bcrypt';

async create(username: string, password: string) {
 const hash = await bcrypt.hash(password, 10);

 const user = new this.userModel({
   username,
   password: hash
 });

 return user.save();
}
```

---

## 6. Validar Login

## auth.service.ts

```ts
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

async login(username: string, password: string) {
 const user = await this.userModel.findOne({ username });

 if (!user) {
   throw new UnauthorizedException('Usuario no válido');
 }

 const ok = await bcrypt.compare(password, user.password);

 if (!ok) {
   throw new UnauthorizedException('Contraseña incorrecta');
 }

 return { mensaje: 'Acceso concedido' };
}
```

---

## 7. Controlador

## auth.controller.ts

```ts
import { Body, Controller, Get, Post, Res } from '@nestjs/common';

@Controller()
export class AuthController {

 @Get()
 form(@Res() res) {
   res.sendFile('login.html', { root: '.' });
 }

 @Post('login')
 async login(@Body() body, @Res() res) {
   try {
     // llamar servicio
     res.send('<h1>Bienvenido</h1>');
   } catch {
     res.redirect('/error.html');
   }
 }
}
```

---

## 8. Formulario HTML

## login.html

```html
<!DOCTYPE html>
<html>
<head>
<title>Login</title>
</head>
<body>

<h2>Ingreso</h2>

<form method="POST" action="/login">
  <input name="username" placeholder="Usuario"><br><br>
  <input type="password" name="password" placeholder="Contraseña"><br><br>
  <button type="submit">Entrar</button>
</form>

</body>
</html>
```

---

## 9. Página de Error

## error.html

```html
<!DOCTYPE html>
<html>
<body>
<h1>Acceso denegado</h1>
<p>Usuario o contraseña no válidos.</p>
<a href="/">Volver</a>
</body>
</html>
```

---

## 10. Flujo

1. Usuario abre formulario
2. Envía usuario y contraseña
3. NestJS consulta MongoDB
4. Compara contraseña con bcrypt
5. Si coincide:
   - acceso permitido
6. Si falla:
   - redirección a error.html

---

## 11. Seguridad recomendada

- bcrypt rounds 10 o más
- HTTPS obligatorio
- Validación DTO
- Rate limiting
- Sanitizar entradas
- Bloqueo tras múltiples intentos
- Variables .env
- Helmet middleware

---

## 12. Crear usuario inicial

```ts
await usersService.create('admin', '123456');
```

---



## 13. Resumen

Este modelo es ideal para:

- Sistemas empresariales internos
- Intranets
- Paneles administrativos
- Apps tradicionales con usuarios propios y roles de autorización personalidados (ajustados a las necesidades de la empresa)

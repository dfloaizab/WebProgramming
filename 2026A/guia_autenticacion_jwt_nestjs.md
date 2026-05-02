# Universidad Santiago de Cali - Programación Web 2026A
# Guía: Autenticación JWT con NestJS + HTML Sencillo

## Objetivo
Construir una autenticación básica con:
- Backend en NestJS
- Login con usuario/contraseña
- Emisión de JWT
- Ruta protegida
- Frontend HTML simple

## 1. Crear proyecto

```bash
npm i -g @nestjs/cli
nest new auth-demo
cd auth-demo
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt
```

## 2. Estructura sugerida

```text
src/
  auth/
    auth.module.ts
    auth.service.ts
    auth.controller.ts
    jwt.strategy.ts
  users/
    users.service.ts
```

## 3. UsersService (demo)

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, username: 'admin', password: '123456' }
  ];

  findByUsername(username: string) {
    return this.users.find(u => u.username === username);
  }
}
```

## 4. AuthService

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(username: string, password: string) {
    const user = this.usersService.findByUsername(username);

    if (!user || user.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }
}
```

## 5. AuthController

```ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.username, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  profile(@Req() req) {
    return req.user;
  }
}
```

## 6. JWT Strategy

```ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'mi_clave_secreta'
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username
    };
  }
}
```

## 7. AuthModule

```ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'mi_clave_secreta',
      signOptions: { expiresIn: '1h' }
    })
  ]
})
export class AuthModule {}
```

## 8. HTML Cliente

```html
<!DOCTYPE html>
<html>
<body>
<h2>Login</h2>

<input id="user" placeholder="usuario">
<input id="pass" type="password" placeholder="clave">
<button onclick="login()">Entrar</button>
<button onclick="profile()">Perfil</button>

<pre id="out"></pre>

<script>
let token = "";

async function login() {
  const r = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await r.json();
  token = data.access_token;
  out.textContent = JSON.stringify(data, null, 2);
}

async function profile() {
  const r = await fetch("http://localhost:3000/auth/profile", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await r.json();
  out.textContent = JSON.stringify(data, null, 2);
}
</script>
</body>
</html>
```

## 9. Flujo

1. Usuario envía credenciales.
2. NestJS valida usuario.
3. Backend genera JWT.
4. Frontend guarda token.
5. Frontend envía Bearer Token.
6. Backend valida token y permite acceso.

## 10. Buenas prácticas

- Nunca guardar contraseñas en texto plano.
- Usar bcrypt.
- Usar HTTPS.
- Secretos en `.env`.
- Refresh tokens.
- Expiración corta.
- Roles y permisos.

## 11. Próximos pasos

- Registro de usuarios
- Recuperación de contraseña
- OAuth Google/GitHub
- 2FA
- Cookies HttpOnly

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extraer el token del header Authorization
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey', // Debe coincidir con la clave secreta usada al generar el token
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }; // Aquí puedes agregar más datos si es necesario
  }
}

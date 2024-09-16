import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Método para generar un JWT
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      user:{
        id: user.id,
        username: user.username,
      },
      access_token: this.jwtService.sign(payload), 
    };
  }
}

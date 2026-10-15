import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'correo_electronico',
      passwordField: 'password',
    });
  }

  async validate(correo_electronico: string, password: string) {
    const user = await this.authService.validateUser(
      correo_electronico,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales no válidas');
    }
    return user;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Types } from 'mongoose';

import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

interface UserDocument {
  _id: Types.ObjectId;
  correo_electronico: string;
  rol_asignado: string;
  estado_actual: boolean;
  tenantId: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
      algorithms: ['HS256'],
      issuer: 'vigixai-api',
      audience: 'vigixai-client',
    });
  }

  async validate(req: Request, payload: any) {
    // Solo access tokens
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Tipo de token inválido');
    }

    const token = req.headers.authorization?.replace('Bearer ', '');

    // Verificar blacklist
    if (token && (await this.authService.isTokenBlacklisted(token))) {
      throw new UnauthorizedException('Token revocado');
    }

    const user = await this.usersService.findByCorreo(payload.email);
    const userDoc = user as unknown as UserDocument;

    if (!userDoc || userDoc.estado_actual !== true) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    return {
      sub: userDoc._id.toString(),
      email: userDoc.correo_electronico,
      role: userDoc.rol_asignado,
      estado: userDoc.estado_actual,
      tenantId: userDoc.tenantId,
    };
  }
}

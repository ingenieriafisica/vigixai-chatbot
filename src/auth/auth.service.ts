import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';

import { UsersService } from 'src/users/users.service';
import { TokenBlacklistService } from './tokenblacklist.service';
import { LoginAuthDto } from './dto/login-auth.dto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  user: {
    correo_electronico: string;
    rol_asignado: string;
    estado_actual: boolean;
    tenantId: number;
  };
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  estado: boolean;
  tenantId: number;
  type: 'access' | 'refresh';
  jti: string;
}

interface UserDocument {
  _id: Types.ObjectId;
  correo_electronico: string;
  rol_asignado: string;
  estado_actual: boolean;
  tenantId: number;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly configService: ConfigService,
  ) {}

  /** Valida usuario - mensaje unificado para evitar user enumeration */
  async validateUser(correo_electronico: string, password: string) {
    const user = await this.usersService.findByCorreo(correo_electronico);

    // MISMO mensaje seja usuario no existe o password incorrecto
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    if (user.estado_actual !== true) {
      throw new UnauthorizedException('Cuenta desactivada');
    }

    return user;
  }

  /** Login: emite Access Token (15m) + Refresh Token (7d) con rotación */
  async login(loginDto: LoginAuthDto): Promise<TokenPair> {
    const user = await this.validateUser(
      loginDto.correo_electronico,
      loginDto.password,
    );
    const userDoc = user as unknown as UserDocument;

    const payloadBase = {
      sub: userDoc._id.toString(),
      email: userDoc.correo_electronico,
      role: userDoc.rol_asignado,
      estado: userDoc.estado_actual,
      tenantId: userDoc.tenantId,
    };

    // Access Token: 15 minutos
    const accessTokenJti = uuidv4();
    const accessToken = await this.jwtService.signAsync({
      ...payloadBase,
      type: 'access',
      jti: accessTokenJti,
    });

    // Refresh Token: 7 días
    const refreshTokenJti = uuidv4();
    const refreshToken = await this.jwtService.signAsync(
      {
        ...payloadBase,
        type: 'refresh',
        jti: refreshTokenJti,
      },
      {
        expiresIn: this.configService.get<string>('JWT_REFRESH_TTL', '7d'),
      },
    );

    // Guardar hash del refresh token en Redis (keyed by userId + jti)
    const refreshHash = await bcrypt.hash(refreshTokenJti, 12);
    await this.tokenBlacklistService.storeRefreshToken(
      userDoc._id.toString(),
      refreshTokenJti,
      refreshHash,
      7 * 24 * 60 * 60, // 7 días TTL
    );

    return {
      accessToken,
      refreshToken,
      user: {
        correo_electronico: userDoc.correo_electronico,
        rol_asignado: userDoc.rol_asignado,
        estado_actual: userDoc.estado_actual,
        tenantId: userDoc.tenantId,
      },
    };
  }

  /** Refresh: rota el refresh token (invalida el anterior) */
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token tipo inválido');
    }

    // Verificar que el refresh token no ha sido revocado (rotado)
    const isValid = await this.tokenBlacklistService.verifyRefreshToken(
      payload.sub,
      payload.jti,
    );
    if (!isValid) {
      // Posible reutilización de token robado → revocar TODOS los tokens del usuario
      await this.tokenBlacklistService.revokeAllUserTokens(payload.sub);
      throw new UnauthorizedException(
        'Sesión comprometida. Inicie sesión nuevamente.',
      );
    }

    const user = await this.usersService.findByCorreo(payload.email);
    if (!user || user.estado_actual !== true) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    const userDoc = user as unknown as UserDocument;

    // Revocar el refresh token usado (rotación)
    await this.tokenBlacklistService.revokeRefreshToken(
      payload.sub,
      payload.jti,
    );

    // Emitir nuevo par de tokens
    return this.login({
      correo_electronico: userDoc.correo_electronico,
      password: '',
    });
  }

  /** Logout: revoca access token (blacklist) y opcionalmente refresh tokens del usuario */
  async logout(
    accessToken: string,
    _userId: string,
  ): Promise<{ message: string }> {
    // Blacklist del access token actual
    await this.tokenBlacklistService.blacklistToken(accessToken);

    return { message: 'Sesión cerrada exitosamente' };
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.tokenBlacklistService.isBlacklisted(token);
  }
}

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenBlacklistService implements OnModuleDestroy {
  private redis: Redis;
  private readonly accessPrefix = 'bl:access:';
  private readonly userRefreshPrefix = 'user:refresh:';

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    this.redis.connect().catch(console.error);
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  /** Blacklist access token (usa JTI como clave, no token completo) */
  async blacklistToken(token: string): Promise<void> {
    try {
      const decoded = this.jwtService.decode(token) as {
        exp: number;
        jti?: string;
      };
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      const key = decoded.jti
        ? `${this.accessPrefix}${decoded.jti}`
        : `${this.accessPrefix}${token}`;

      if (ttl > 0) {
        await this.redis.setex(key, ttl, 'revoked');
      }
    } catch {
      // Token malformado, ignorar
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.decode(token) as { jti?: string };
      const key = decoded.jti
        ? `${this.accessPrefix}${decoded.jti}`
        : `${this.accessPrefix}${token}`;
      const result = await this.redis.get(key);
      return result !== null;
    } catch {
      return false;
    }
  }

  /** Almacena hash del refresh token para validación posterior */
  async storeRefreshToken(
    userId: string,
    jti: string,
    hash: string,
    ttl: number,
  ): Promise<void> {
    const key = `${this.userRefreshPrefix}${userId}:${jti}`;
    await this.redis.setex(key, ttl, hash);

    // Índice para revocación masiva
    await this.redis.sadd(`${this.userRefreshPrefix}${userId}:index`, key);
    await this.redis.expire(`${this.userRefreshPrefix}${userId}:index`, ttl);
  }

  /** Verifica si el refresh token es válido (no rotado) */
  async verifyRefreshToken(userId: string, jti: string): Promise<boolean> {
    const key = `${this.userRefreshPrefix}${userId}:${jti}`;
    const storedHash = await this.redis.get(key);
    return storedHash !== null;
  }

  /** Revoca un refresh token específico (rotación) */
  async revokeRefreshToken(userId: string, jti: string): Promise<void> {
    const key = `${this.userRefreshPrefix}${userId}:${jti}`;
    await this.redis.del(key);
    await this.redis.srem(`${this.userRefreshPrefix}${userId}:index`, key);
  }

  /** Revoca TODOS los refresh tokens de un usuario (compromiso de seguridad) */
  async revokeAllUserTokens(userId: string): Promise<void> {
    const indexKey = `${this.userRefreshPrefix}${userId}:index`;
    const keys = await this.redis.smembers(indexKey);

    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
    await this.redis.del(indexKey);
  }
}

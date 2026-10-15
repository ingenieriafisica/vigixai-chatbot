import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { TokenBlacklistService } from './tokenblacklist.service';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Throttler global para login y protección general
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'login',
            ttl: config.get<number>('THROTTLE_LOGIN_TTL', 300),
            limit: config.get<number>('THROTTLE_LOGIN_LIMIT', 5),
          },
          {
            name: 'default',
            ttl: 60,
            limit: 100,
          },
        ],
      }),
    }),
    // JWT con configuración segura
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_TTL', '15m'),
          algorithm: 'HS256',
          issuer: 'vigixai-api',
          audience: 'vigixai-client',
        },
        verifyOptions: {
          algorithms: ['HS256'],
          issuer: 'vigixai-api',
          audience: 'vigixai-client',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, TokenBlacklistService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

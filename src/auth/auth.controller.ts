import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Get,
  Ip,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService, TokenPair } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './jwtauth.guard';
import { Public } from 'src/decorators/public.decorator';
import { Request } from 'express';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@ApiTags('Autenticación')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @Throttle({ login: { limit: 5, ttl: 300 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  async login(
    @Body() loginDto: LoginAuthDto,
    @Ip() ip: string,
  ): Promise<TokenPair> {
    console.log(
      `[AUTH] Login attempt from IP: ${ip}, email: ${loginDto.correo_electronico}`,
    );
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token con refresh token' })
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Ip() ip: string,
  ): Promise<TokenPair> {
    console.log(`[AUTH] Token refresh from IP: ${ip}`);
    return this.authService.refreshTokens(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  async logout(
    @Req() req: Request,
    @Ip() ip: string,
  ): Promise<{ message: string }> {
    const token = req.headers.authorization?.split(' ')[1];
    const user = req.user as { sub: string; email: string };

    console.log(`[AUTH] Logout user: ${user.email} from IP: ${ip}`);
    return this.authService.logout(token!, user.sub);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario actual' })
  me(@Req() req: Request): UserResponseDto {
    return new UserResponseDto(req.user);
  }
}

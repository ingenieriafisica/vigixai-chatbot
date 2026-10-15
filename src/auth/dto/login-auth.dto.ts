import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  correo_electronico: string;

  @ApiProperty({
    description: 'Contraseña asignada',
    example: '87459781',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

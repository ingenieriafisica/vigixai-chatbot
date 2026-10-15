import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'ID del tenant para multi-tenancy',
    example: 1234567890,
  })
  @IsNotEmpty()
  @IsNumber()
  tenantId: number;

  @ApiProperty({
    description: 'Tipo de identificación del usuario (ej. C.C., Pasaporte)',
    example: 'C.C.',
  })
  @IsNotEmpty()
  @IsString()
  tipo_de_identificacion: string;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    example: 'Juan',
  })
  @IsNotEmpty()
  @IsString()
  primer_nombre: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre del usuario',
    example: 'Carlos',
  })
  @IsOptional()
  @IsString()
  segundo_nombre?: string;

  @ApiProperty({
    description: 'Primer apellido del usuario',
    example: 'Pérez',
  })
  @IsNotEmpty()
  @IsString()
  primer_apellido: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del usuario',
    example: 'González',
  })
  @IsOptional()
  @IsString()
  segundo_apellido?: string;

  @ApiProperty({
    description:
      'Fecha de nacimiento del usuario en formato ISO 8601 (YYYY-MM-DD)',
    example: '1990-05-15',
  })
  @IsNotEmpty()
  @IsDateString() // Mongoose convertirá de string a Date en el backend
  fecha_nacimiento: string;

  @ApiProperty({
    description: 'País de residencia del usuario',
    example: 'Colombia',
  })
  @IsNotEmpty()
  @IsString()
  pais_residencia: string;

  @ApiProperty({
    description: 'Departamento de residencia del usuario',
    example: 'Antioquia',
  })
  @IsNotEmpty()
  @IsString()
  dpto_residencia: string;

  @ApiProperty({
    description: 'Municipio de residencia del usuario',
    example: 'Medellín',
  })
  @IsNotEmpty()
  @IsString()
  mncpio_residencia: string;

  @ApiProperty({
    description: 'Dirección de residencia del usuario',
    example: 'Calle 10 # 20-30',
  })
  @IsNotEmpty()
  @IsString()
  direccion_residencia: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico personal del usuario',
    example: 'usuario.personal@example.com',
  })
  @IsOptional()
  @IsEmail()
  correo_particular?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono de la entidad',
    example: '6041234567',
  })
  @IsOptional()
  @IsString()
  telefono_entidad?: string;

  @ApiPropertyOptional({
    description: 'Extensión telefónica de la entidad',
    example: '1234',
  })
  @IsOptional()
  @IsString()
  extension_telefonica?: string;

  @ApiProperty({
    description: 'Número de celular del usuario',
    example: '3101234567',
  })
  @IsNotEmpty()
  @IsString()
  numero_celular: string;

  @ApiPropertyOptional({
    description: 'Estado actual del usuario (activo/inactivo)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  estado_actual?: boolean;

  @ApiProperty({
    description:
      'Fecha de inicio del contrato del usuario en formato ISO 8601 (YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @IsNotEmpty()
  @IsDateString() // Mongoose convertirá de string a Date en el backend
  fecha_inicio_contrato: string; // Tipo 'string' para la entrada JSON

  @ApiPropertyOptional({
    description:
      'Fecha de fin del contrato del usuario en formato ISO 8601 (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString() // Mongoose convertirá de string a Date en el backend
  fecha_fin_contrato?: string; // Tipo 'string' para la entrada JSON

  @ApiPropertyOptional({
    description: 'Número de contrato del usuario',
    example: 'CONTRATO-001',
  })
  @IsOptional()
  @IsString()
  numero_contrato?: string;

  @ApiProperty({
    description: 'Nombre de usuario o alias asignado al usuario',
    example: 'j.perez',
  })
  @IsNotEmpty()
  @IsString()
  usuario_asignado: string;

  @ApiProperty({
    description: 'Rol asignado al usuario dentro del sistema',
    example: 'Administrador',
  })
  @IsNotEmpty()
  @IsString()
  rol_asignado: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    example: 'PasswordSeguro123',
  })
  @IsNotEmpty() // La contraseña es requerida para crear un usuario
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string; // La contraseña no es opcional para la creación
}

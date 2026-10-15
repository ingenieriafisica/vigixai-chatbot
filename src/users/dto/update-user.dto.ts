import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEmail, IsDateString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Sobrescribir campos opcionales con validación explícita
  @ApiPropertyOptional({ description: 'Correo electrónico', example: 'nuevo@example.com' })
  @IsOptional()
  @IsEmail()
  correo_electronico?: string;

  @ApiPropertyOptional({ description: 'Nombre', example: 'Juan Carlos' })
  @IsOptional()
  @IsString()
  primer_nombre?: string;

  @ApiPropertyOptional({ description: 'Apellido', example: 'Pérez González' })
  @IsOptional()
  @IsString()
  primer_apellido?: string;

  @ApiPropertyOptional({ description: 'Celular', example: '3109876543' })
  @IsOptional()
  @IsString()
  numero_celular?: string;

  @ApiPropertyOptional({ description: 'Estado', example: true })
  @IsOptional()
  @IsBoolean()
  estado_actual?: boolean;

  // Campos adicionales permitidos en update
  @ApiPropertyOptional({ description: 'Teléfono entidad' })
  @IsOptional()
  @IsString()
  telefono_entidad?: string;

  @ApiPropertyOptional({ description: 'Dirección' })
  @IsOptional()
  @IsString()
  direccion_residencia?: string;

  @ApiPropertyOptional({ description: 'Fecha nacimiento (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiPropertyOptional({ description: 'Tipo identificación' })
  @IsOptional()
  @IsString()
  tipo_de_identificacion?: string;

  @ApiPropertyOptional({ description: 'País residencia' })
  @IsOptional()
  @IsString()
  pais_residencia?: string;

  @ApiPropertyOptional({ description: 'Departamento residencia' })
  @IsOptional()
  @IsString()
  dpto_residencia?: string;

  @ApiPropertyOptional({ description: 'Municipio residencia' })
  @IsOptional()
  @IsString()
  mncpio_residencia?: string;

  @ApiPropertyOptional({ description: 'Fecha fin contrato (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fecha_fin_contrato?: string;

  @ApiPropertyOptional({ description: 'Número contrato' })
  @IsOptional()
  @IsString()
  numero_contrato?: string;

  @ApiPropertyOptional({ description: 'Correo personal' })
  @IsOptional()
  @IsEmail()
  correo_particular?: string;

  @ApiPropertyOptional({ description: 'Extensión telefónica' })
  @IsOptional()
  @IsString()
  extension_telefonica?: string;
}
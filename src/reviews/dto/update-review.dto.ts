import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiPropertyOptional({ description: 'Nombre completo' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre_completo?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico' })
  @IsOptional()
  @IsEmail()
  correo_electronico?: string;

  @ApiPropertyOptional({ description: 'Tipo de solicitud', example: 'Petición' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tipo_solicitud?: string;

  @ApiPropertyOptional({ description: 'Mensaje PQRS' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mensaje_pqrs?: string;

  @ApiPropertyOptional({ description: 'Calificación (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  calificacion_dada?: number;
}
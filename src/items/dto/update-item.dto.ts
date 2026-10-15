import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiPropertyOptional({ description: 'Modelo de IA' })
  @IsOptional()
  @IsString()
  modeloIA?: string;

  @ApiPropertyOptional({ description: 'Código norma' })
  @IsOptional()
  @IsString()
  codigoNorma?: string;

  @ApiPropertyOptional({ description: 'Código item' })
  @IsOptional()
  @IsString()
  codigoItem?: string;

  @ApiPropertyOptional({ description: 'Rol' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ description: 'Contenido' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Evidencias conocimiento' })
  @IsOptional()
  @IsString()
  evidenciasConocimiento?: string;

  @ApiPropertyOptional({ description: 'Conocimiento esencial' })
  @IsOptional()
  @IsString()
  conocimientoEsencial?: string;

  @ApiPropertyOptional({ description: 'Criterio desempeño' })
  @IsOptional()
  @IsString()
  criterioDesempeno?: string;

  @ApiPropertyOptional({ description: 'Tipo criterio conocimiento' })
  @IsOptional()
  @IsString()
  tipoCriterioConocimiento?: string;

  @ApiPropertyOptional({ description: 'Actividad' })
  @IsOptional()
  @IsString()
  actividad?: string;

  @ApiPropertyOptional({ description: 'Nivel competencia' })
  @IsOptional()
  @IsString()
  niveldeCompetencia?: string;

  @ApiPropertyOptional({ description: 'Descripción nivel competencia' })
  @IsOptional()
  @IsString()
  descripcionNiveldeCompetencia?: string;
}
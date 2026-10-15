import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class ItemResponseDto {
  @ApiProperty({ description: 'ID único del item' })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiPropertyOptional({ description: 'Modelo de IA usado' })
  @Expose()
  modeloIA?: string;

  @ApiPropertyOptional({ description: 'Código de la norma' })
  @Expose()
  codigoNorma?: string;

  @ApiPropertyOptional({ description: 'Código del item generado' })
  @Expose()
  codigoItem?: string;

  @ApiPropertyOptional({ description: 'Rol del usuario creador' })
  @Expose()
  role?: string;

  @ApiProperty({ description: 'Contenido de la respuesta' })
  @Expose()
  content: string;

  @ApiProperty({ description: 'ID del usuario propietario' })
  @Expose()
  @Transform(({ obj }) => obj.userId?.toString?.() || obj.userId)
  userId: string;

  @ApiPropertyOptional({ description: 'Evidencias de conocimiento' })
  @Expose()
  evidenciasConocimiento?: string;

  @ApiPropertyOptional({ description: 'Conocimiento esencial' })
  @Expose()
  conocimientoEsencial?: string;

  @ApiPropertyOptional({ description: 'Criterio de desempeño' })
  @Expose()
  criterioDesempeno?: string;

  @ApiPropertyOptional({ description: 'Tipo de criterio de conocimiento' })
  @Expose()
  tipoCriterioConocimiento?: string;

  @ApiPropertyOptional({ description: 'Actividad asociada' })
  @Expose()
  actividad?: string;

  @ApiPropertyOptional({ description: 'Nivel de competencia' })
  @Expose()
  niveldeCompetencia?: string;

  @ApiPropertyOptional({ description: 'Descripción del nivel de competencia' })
  @Expose()
  descripcionNiveldeCompetencia?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  // 🔒 EXCLUIDOS - Nunca se serializan
  @Exclude()
  __v: number;

  @Exclude()
  internalScore: number;

  constructor(partial: Partial<ItemResponseDto>) {
    Object.assign(this, partial);
  }
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class ReviewResponseDto {
  @ApiProperty({ description: 'ID único de la reseña' })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty({ description: 'Nombre completo del usuario' })
  @Expose()
  nombre_completo: string;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @Expose()
  correo_electronico: string;

  @ApiProperty({ description: 'Tipo de solicitud (PQR)' })
  @Expose()
  tipo_solicitud: string;

  @ApiProperty({ description: 'Mensaje de la solicitud PQRS' })
  @Expose()
  mensaje_pqrs: string;

  @ApiPropertyOptional({ description: 'Calificación dada (1 a 5)', minimum: 1, maximum: 5 })
  @Expose()
  calificacion_dada?: number;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  // 🔒 EXCLUIDOS
  @Exclude()
  __v: number;

  constructor(partial: Partial<ReviewResponseDto>) {
    Object.assign(this, partial);
  }
}
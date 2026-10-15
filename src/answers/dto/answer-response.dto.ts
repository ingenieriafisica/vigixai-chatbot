import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class AnswerResponseDto {
  @ApiProperty({ description: 'ID único de la respuesta' })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty({ description: 'Rol del usuario', example: 'dinamizador' })
  @Expose()
  role: string;

  @ApiProperty({ description: 'Contenido de la respuesta' })
  @Expose()
  content: string;

  @ApiProperty({ description: 'ID del usuario propietario' })
  @Expose()
  @Transform(({ obj }) => obj.userId?.toString?.() || obj.userId)
  userId: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  @Exclude()
  __v: number;

  constructor(partial: Partial<AnswerResponseDto>) {
    Object.assign(this, partial);
  }
}
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class PromptResponseDto {
  @ApiProperty({ description: 'ID único del prompt' })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty({ description: 'Rol del prompt' })
  @Expose()
  role: string;

  @ApiProperty({ description: 'Contenido del prompt' })
  @Expose()
  content: string;

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

  constructor(partial: Partial<PromptResponseDto>) {
    Object.assign(this, partial);
  }
}
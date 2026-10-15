import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateAnswerDto {
  @ApiProperty({
    description: 'El rol del usuario que creó la respuesta (ej. "dinamizador")',
    example: 'dinamizador',
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    description: 'El contenido de la respuesta',
    example: 'Aquí te dejo una posible pregunta para evaluar...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'El ID del usuario al que pertenece esta respuesta',
    example: '687d15aaa2c7e5ea31b2117f',
    type: String,
  })
  @IsNotEmpty()
  userId: Types.ObjectId;
}

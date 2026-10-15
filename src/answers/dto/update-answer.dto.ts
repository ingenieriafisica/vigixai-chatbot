import { PartialType } from '@nestjs/swagger';
import { CreateAnswerDto } from './create-answer.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {
  @ApiPropertyOptional({ description: 'Rol del usuario' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  role?: string;

  @ApiPropertyOptional({ description: 'Contenido de la respuesta' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
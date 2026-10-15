import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePromptDto {
  @ApiProperty({ description: 'Rol del prompt (user, assistant, system)', example: 'system' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ description: 'Contenido del prompt', example: 'Eres un asistente útil...' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
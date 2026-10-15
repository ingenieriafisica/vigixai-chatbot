import { PartialType } from '@nestjs/swagger';
import { CreatePromptDto } from './create-prompt.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePromptDto extends PartialType(CreatePromptDto) {
  @ApiPropertyOptional({ description: 'Rol del prompt' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ description: 'Contenido del prompt' })
  @IsOptional()
  @IsString()
  content?: string;
}
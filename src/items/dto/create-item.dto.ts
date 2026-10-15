import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({
    description: 'Modelo de languaje usado',
    example: 'Grok4',
    required: false,
  })
  @IsOptional()
  @IsString()
  modeloIA?: string;

  @ApiProperty({
    description: 'Código de la norma',
    example: '28014785',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigoNorma?: string;

  @ApiProperty({
    description: 'Código que identifica al item generado',
    example: 'NCSL_CA_CD_1.8',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigoItem?: string;

  @ApiProperty({
    description: 'El rol del usuario que creó la respuesta (ej. "dinamizador")',
    example: 'dinamizador',
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: string;

  // --- Campo OBLIGATORIO ---
  @ApiProperty({ description: 'El contenido de la respuesta' })
  @IsString()
  @IsNotEmpty()
  content: string;

  // --- Campo OBLIGATORIO (Se usa string porque el ID viene como string en el payload) ---
  @ApiProperty({
    description: 'El ID del usuario al que pertenece esta respuesta',
    type: String,
  })
  @IsNotEmpty()
  @IsString() // Se valida como string porque en el DTO se recibe como string
  userId: string; // Cambiado a 'string' para recibir el ObjectId

  // --- Campos Opcionales nuevos o restaurados a opcional ---
  @ApiProperty({ description: 'Evidencias de conocimiento', required: false })
  @IsOptional()
  @IsString()
  evidenciasConocimiento?: string;

  @ApiProperty({ description: 'Conocimiento esencial', required: false })
  @IsOptional()
  @IsString()
  conocimientoEsencial?: string;

  @ApiProperty({ description: 'Criterio de desempeño', required: false })
  @IsOptional()
  @IsString()
  criterioDesempeno?: string;

  @ApiProperty({
    description: 'Tipo de criterio de conocimiento',
    required: false,
  })
  @IsOptional()
  @IsString()
  tipoCriterioConocimiento?: string;

  @ApiProperty({ description: 'Actividad asociada', required: false })
  @IsOptional()
  @IsString()
  actividad?: string;

  @ApiProperty({ description: 'Nivel de competencia', required: false })
  @IsOptional()
  @IsString()
  niveldeCompetencia?: string;

  @ApiProperty({
    description: 'Descripción del nivel de competencia',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcionNiveldeCompetencia?: string;
}

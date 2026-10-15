import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer'; // Necesario para mapear objetos anidados

// --- Sub-DTOs para la estructura anidada ---

// 1. DTO para las descripciones de CriterioDesempenoGeneral
export class DescripcionCriterioDesempenoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ type: [String], default: [] })
  @IsArray()
  @IsString({ each: true })
  actividadesAsociadas: string[];
}

// 2. DTO para CriterioDesempenoGeneral
export class CriterioDesempenoGeneralDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ type: [DescripcionCriterioDesempenoDto], default: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DescripcionCriterioDesempenoDto)
  descripciones: DescripcionCriterioDesempenoDto[];
}

// 3. DTO para las descripciones de EvidenciaRequerida
export class DescripcionEvidenciaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ type: [String], default: [] })
  @IsArray()
  @IsString({ each: true })
  criteriosAsociados: string[];
}

// 4. DTO para EvidenciaRequerida
export class EvidenciaRequeridaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ type: [DescripcionEvidenciaDto], default: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DescripcionEvidenciaDto)
  descripciones: DescripcionEvidenciaDto[];
}

// 5. DTO para ActividadClave
export class ActividadClaveDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ type: [String], default: [] })
  @IsArray()
  @IsString({ each: true })
  criteriosDesempeno: string[];
}

// 6. DTO para ConocimientoEsencial
export class ConocimientoEsencialDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ type: [String], default: [] })
  @IsArray()
  @IsString({ each: true })
  criteriosAsociados: string[];
}

// ----------------------------------------------------

// --- DTO Principal (CreateNormDto) ---
export class CreateNormDto {
  @ApiProperty({
    description: 'Código de la norma de certificación.',
    example: '2984785',
  })
  @IsString()
  @IsNotEmpty({ message: 'El campo "codigoNorma" es obligatorio' })
  codigoNorma: string;

  @ApiProperty({ description: 'Versión de la norma.' })
  @IsOptional() // Marcarlo como opcional si no es estrictamente requerido
  @IsString()
  versionNorma: string;

  @ApiProperty({
    description: 'Nombre de la norma de certificación.',
    example: 'norma barrer calles',
  })
  @IsString()
  @IsNotEmpty({ message: 'El campo "normaCertificacion" es obligatorio' })
  normaCertificacion: string;

  // Array de ActividadClaveDto
  @ApiProperty({ type: [ActividadClaveDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActividadClaveDto)
  actividadesClave: ActividadClaveDto[];

  // Array de CriterioDesempenoGeneralDto
  @ApiProperty({ type: [CriterioDesempenoGeneralDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriterioDesempenoGeneralDto)
  criteriosDesempenoGenerales: CriterioDesempenoGeneralDto[];

  // Array de ConocimientoEsencialDto
  @ApiProperty({ type: [ConocimientoEsencialDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConocimientoEsencialDto)
  conocimientosEsenciales: ConocimientoEsencialDto[];

  // Array de EvidenciaRequeridaDto
  @ApiProperty({ type: [EvidenciaRequeridaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvidenciaRequeridaDto)
  evidenciasRequeridas: EvidenciaRequeridaDto[];
}

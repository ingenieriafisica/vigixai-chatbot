import { PartialType } from '@nestjs/swagger';
import { CreateNormDto } from './create-norm.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Sub-DTOs necesarios para update (reutilizar de create-norm.dto.ts)
import {
  DescripcionCriterioDesempenoDto,
  CriterioDesempenoGeneralDto,
  DescripcionEvidenciaDto,
  EvidenciaRequeridaDto,
  ActividadClaveDto,
  ConocimientoEsencialDto,
} from './create-norm.dto';

export class UpdateNormDto extends PartialType(CreateNormDto) {
  @ApiPropertyOptional({ description: 'Código de la norma' })
  @IsOptional()
  @IsString()
  codigoNorma?: string;

  @ApiPropertyOptional({ description: 'Versión de la norma' })
  @IsOptional()
  @IsString()
  versionNorma?: string;

  @ApiPropertyOptional({ description: 'Nombre de la norma' })
  @IsOptional()
  @IsString()
  normaCertificacion?: string;

  @ApiPropertyOptional({ type: [ActividadClaveDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActividadClaveDto)
  actividadesClave?: ActividadClaveDto[];

  @ApiPropertyOptional({ type: [CriterioDesempenoGeneralDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriterioDesempenoGeneralDto)
  criteriosDesempenoGenerales?: CriterioDesempenoGeneralDto[];

  @ApiPropertyOptional({ type: [ConocimientoEsencialDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConocimientoEsencialDto)
  conocimientosEsenciales?: ConocimientoEsencialDto[];

  @ApiPropertyOptional({ type: [EvidenciaRequeridaDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvidenciaRequeridaDto)
  evidenciasRequeridas?: EvidenciaRequeridaDto[];
}
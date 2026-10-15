import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

// Sub-DTOs de respuesta para estructura anidada
export class DescripcionCriterioDesempenoResponseDto {
  @Expose()
  @ApiProperty()
  descripcion: string;

  @Expose()
  @ApiProperty({ type: [String], default: [] })
  actividadesAsociadas: string[];
}

export class CriterioDesempenoGeneralResponseDto {
  @Expose()
  @ApiProperty()
  nombre: string;

  @Expose()
  @ApiProperty({ type: [DescripcionCriterioDesempenoResponseDto], default: [] })
  @Type(() => DescripcionCriterioDesempenoResponseDto)
  descripciones: DescripcionCriterioDesempenoResponseDto[];
}

export class DescripcionEvidenciaResponseDto {
  @Expose()
  @ApiProperty()
  descripcion: string;

  @Expose()
  @ApiProperty({ type: [String], default: [] })
  criteriosAsociados: string[];
}

export class EvidenciaRequeridaResponseDto {
  @Expose()
  @ApiProperty()
  nombre: string;

  @Expose()
  @ApiProperty({ type: [DescripcionEvidenciaResponseDto], default: [] })
  @Type(() => DescripcionEvidenciaResponseDto)
  descripciones: DescripcionEvidenciaResponseDto[];
}

export class ActividadClaveResponseDto {
  @Expose()
  @ApiProperty()
  descripcion: string;

  @Expose()
  @ApiProperty({ type: [String], default: [] })
  criteriosDesempeno: string[];
}

export class ConocimientoEsencialResponseDto {
  @Expose()
  @ApiProperty()
  descripcion: string;

  @Expose()
  @ApiProperty({ type: [String], default: [] })
  criteriosAsociados: string[];
}

export class NormResponseDto {
  @ApiProperty({ description: 'ID único de la norma' })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty({ description: 'Código de la norma', example: '2984785' })
  @Expose()
  codigoNorma: string;

  @ApiPropertyOptional({ description: 'Versión de la norma' })
  @Expose()
  versionNorma?: string;

  @ApiProperty({ description: 'Nombre de la norma de certificación' })
  @Expose()
  normaCertificacion: string;

  @ApiProperty({ type: [ActividadClaveResponseDto], default: [] })
  @Expose()
  @Type(() => ActividadClaveResponseDto)
  actividadesClave: ActividadClaveResponseDto[];

  @ApiProperty({ type: [CriterioDesempenoGeneralResponseDto], default: [] })
  @Expose()
  @Type(() => CriterioDesempenoGeneralResponseDto)
  criteriosDesempenoGenerales: CriterioDesempenoGeneralResponseDto[];

  @ApiProperty({ type: [ConocimientoEsencialResponseDto], default: [] })
  @Expose()
  @Type(() => ConocimientoEsencialResponseDto)
  conocimientosEsenciales: ConocimientoEsencialResponseDto[];

  @ApiProperty({ type: [EvidenciaRequeridaResponseDto], default: [] })
  @Expose()
  @Type(() => EvidenciaRequeridaResponseDto)
  evidenciasRequeridas: EvidenciaRequeridaResponseDto[];

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

  constructor(partial: Partial<NormResponseDto>) {
    Object.assign(this, partial);
  }
}
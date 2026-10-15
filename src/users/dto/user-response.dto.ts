import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class UserResponseDto {
  @ApiProperty({ description: 'ID único del usuario' })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty({ description: 'Tenant ID' })
  @Expose()
  tenantId: number;

  @ApiProperty({ description: 'Tipo de identificación' })
  @Expose()
  tipo_de_identificacion: string;

  @ApiProperty({ description: 'Nombre completo computado' })
  @Expose()
  get nombre_completo(): string {
    return `${this.primer_nombre} ${this.segundo_nombre || ''} ${this.primer_apellido} ${this.segundo_apellido || ''}`.trim();
  }

  @ApiProperty({ description: 'Primer nombre' })
  @Expose()
  primer_nombre: string;

  @ApiPropertyOptional({ description: 'Segundo nombre' })
  @Expose()
  segundo_nombre?: string;

  @ApiProperty({ description: 'Primer apellido' })
  @Expose()
  primer_apellido: string;

  @ApiPropertyOptional({ description: 'Segundo apellido' })
  @Expose()
  segundo_apellido?: string;

  @ApiProperty({ description: 'Fecha de nacimiento' })
  @Expose()
  @Type(() => Date)
  fecha_nacimiento: Date;

  @ApiProperty({ description: 'País de residencia' })
  @Expose()
  pais_residencia: string;

  @ApiProperty({ description: 'Departamento de residencia' })
  @Expose()
  dpto_residencia: string;

  @ApiProperty({ description: 'Municipio de residencia' })
  @Expose()
  mncpio_residencia: string;

  @ApiProperty({ description: 'Dirección de residencia' })
  @Expose()
  direccion_residencia: string;

  @ApiProperty({ description: 'Correo electrónico principal' })
  @Expose()
  correo_electronico: string;

  @ApiPropertyOptional({ description: 'Correo personal' })
  @Expose()
  correo_particular?: string;

  @ApiPropertyOptional({ description: 'Teléfono entidad' })
  @Expose()
  telefono_entidad?: string;

  @ApiPropertyOptional({ description: 'Extensión' })
  @Expose()
  extension_telefonica?: string;

  @ApiProperty({ description: 'Celular' })
  @Expose()
  numero_celular: string;

  @ApiProperty({ description: 'Estado actual' })
  @Expose()
  estado_actual: boolean;

  @ApiProperty({ description: 'Fecha inicio contrato' })
  @Expose()
  @Type(() => Date)
  fecha_inicio_contrato: Date;

  @ApiPropertyOptional({ description: 'Fecha fin contrato' })
  @Expose()
  @Type(() => Date)
  fecha_fin_contrato?: Date;

  @ApiPropertyOptional({ description: 'Número de contrato' })
  @Expose()
  numero_contrato?: string;

  @ApiProperty({ description: 'Usuario asignado' })
  @Expose()
  usuario_asignado: string;

  @ApiProperty({ description: 'Rol asignado' })
  @Expose()
  rol_asignado: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  // 🔒 EXCLUIDOS - Nunca se serializan
  @Exclude()
  password: string;

  @Exclude()
  respuestas: Types.ObjectId[];

  @Exclude()
  __v: number;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
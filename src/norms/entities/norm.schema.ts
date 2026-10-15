import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// --- Subesquemas para la estructura anidada ---

// 1. Subesquema para las descripciones dentro de 'criteriosDesempenoGenerales'
@Schema()
class DescripcionCriterioDesempeno {
  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: [String], default: [] }) // Array de strings (actividadesAsociadas)
  actividadesAsociadas: string[];
}
const DescripcionCriterioDesempenoSchema = SchemaFactory.createForClass(
  DescripcionCriterioDesempeno,
);

// 2. Subesquema para 'criteriosDesempenoGenerales'
@Schema()
class CriterioDesempenoGeneral {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [DescripcionCriterioDesempenoSchema], default: [] }) // Array del subesquema 1
  descripciones: DescripcionCriterioDesempeno[];
}
const CriterioDesempenoGeneralSchema = SchemaFactory.createForClass(
  CriterioDesempenoGeneral,
);

// 3. Subesquema para las descripciones dentro de 'evidenciasRequeridas'
@Schema()
class DescripcionEvidencia {
  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: [String], default: [] }) // Array de strings (criteriosAsociados)
  criteriosAsociados: string[];
}
const DescripcionEvidenciaSchema =
  SchemaFactory.createForClass(DescripcionEvidencia);

// 4. Subesquema para 'evidenciasRequeridas'
@Schema()
class EvidenciaRequerida {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [DescripcionEvidenciaSchema], default: [] }) // Array del subesquema 3
  descripciones: DescripcionEvidencia[];
}
const EvidenciaRequeridaSchema =
  SchemaFactory.createForClass(EvidenciaRequerida);

// 5. Subesquema para 'actividadesClave'
@Schema()
class ActividadClave {
  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: [String], default: [] }) // Array de strings (criteriosDesempeno)
  criteriosDesempeno: string[];
}
const ActividadClaveSchema = SchemaFactory.createForClass(ActividadClave);

// 6. Subesquema para 'conocimientosEsenciales'
@Schema()
class ConocimientoEsencial {
  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: [String], default: [] }) // Array de strings (criteriosAsociados)
  criteriosAsociados: string[];
}
const ConocimientoEsencialSchema =
  SchemaFactory.createForClass(ConocimientoEsencial);

// --- Esquema Principal (Norm) ---

export type NormDocument = HydratedDocument<Norm>;

@Schema({ timestamps: true, versionKey: false })
export class Norm {
  @Prop({ required: true })
  codigoNorma: string;

  // Nuevo campo
  @Prop({ required: false }) // Suponiendo que 'versionNorma' puede no ser estrictamente requerida
  versionNorma: string;

  @Prop({ required: true })
  normaCertificacion: string;

  // Array de ActividadClave (Subesquema 5)
  @Prop({ type: [ActividadClaveSchema], default: [] })
  actividadesClave: ActividadClave[];

  // Array de CriterioDesempenoGeneral (Subesquema 2)
  @Prop({ type: [CriterioDesempenoGeneralSchema], default: [] })
  criteriosDesempenoGenerales: CriterioDesempenoGeneral[];

  // Array de ConocimientoEsencial (Subesquema 6)
  @Prop({ type: [ConocimientoEsencialSchema], default: [] })
  conocimientosEsenciales: ConocimientoEsencial[];

  // Array de EvidenciaRequerida (Subesquema 4)
  @Prop({ type: [EvidenciaRequeridaSchema], default: [] })
  evidenciasRequeridas: EvidenciaRequerida[];
}

export const NormSchema = SchemaFactory.createForClass(Norm);

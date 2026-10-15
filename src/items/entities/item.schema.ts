import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose'; // Importa Types para ObjectId

export type ItemDocument = HydratedDocument<Item>;

@Schema({ versionKey: false, timestamps: true })
export class Item {
  @Prop()
  modeloIA?: string;

  @Prop()
  codigoNorma?: string;

  @Prop()
  codigoItem?: string;

  @Prop()
  role?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  evidenciasConocimiento?: string;

  @Prop()
  conocimientoEsencial?: string;

  @Prop()
  criterioDesempeno?: string;

  @Prop()
  tipoCriterioConocimiento?: string;

  @Prop()
  actividad?: string;

  @Prop()
  niveldeCompetencia?: string;

  @Prop()
  descripcionNiveldeCompetencia?: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

const SECONDS_IN_30_DAYS = 2592000;

ItemSchema.index({ createdAt: 1 }, { expireAfterSeconds: SECONDS_IN_30_DAYS });

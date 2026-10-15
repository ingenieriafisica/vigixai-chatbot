import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose'; // Importa Types para ObjectId

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  // --- Campo Único para Multi-tenancy ---
  // tenantId ahora es el identificador principal y es único y requerido.
  @Prop({ required: true, unique: true })
  tenantId: number;

  @Prop({ required: true })
  tipo_de_identificacion: string;

  @Prop({ required: true })
  primer_nombre: string;

  @Prop()
  segundo_nombre: string;

  @Prop({ required: true })
  primer_apellido: string;

  @Prop()
  segundo_apellido: string;

  @Prop({ required: true })
  fecha_nacimiento: Date;

  @Prop({ required: true })
  pais_residencia: string;

  @Prop({ required: true })
  dpto_residencia: string;

  @Prop({ required: true })
  mncpio_residencia: string;

  @Prop({ required: true })
  direccion_residencia: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  correo_electronico: string;

  @Prop({
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'escriba email personal'],
  })
  correo_particular: string;

  @Prop()
  telefono_entidad: string;

  @Prop()
  extension_telefonica: string;

  @Prop({ required: true })
  numero_celular: string;

  @Prop({ default: true })
  estado_actual: boolean;

  @Prop({ required: true })
  fecha_inicio_contrato: Date;

  @Prop()
  fecha_fin_contrato: Date;

  @Prop({ unique: true, sparse: true })
  numero_contrato: string;

  @Prop({ required: true, unique: true })
  usuario_asignado: string;

  @Prop({ required: true })
  rol_asignado: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Answer' }] })
  respuestas: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

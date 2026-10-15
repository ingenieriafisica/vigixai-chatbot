import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose'; // Importa Types para ObjectId

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({ versionKey: false, timestamps: true })
export class Answer {
  @Prop()
  role: string;

  @Prop()
  content: string;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

const SECONDS_IN_30_DAYS = 2592000;

AnswerSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: SECONDS_IN_30_DAYS },
);

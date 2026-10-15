import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PromptDocument = HydratedDocument<Prompt>;

@Schema({ versionKey: false, timestamps: true })
export class Prompt {
  @Prop()
  role: string;

  @Prop()
  content: string;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);

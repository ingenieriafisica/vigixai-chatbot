import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ versionKey: false, timestamps: true })
export class Session {
  @Prop({ required: true })
  Id: string;

  @Prop()
  ipAddress: string;

  @Prop({ default: null })
  logoutAt: Date;

  @Prop()
  durationInSeconds: number;

  @Prop()
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

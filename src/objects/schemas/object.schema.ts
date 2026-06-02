import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ObjectDocument = HeyamaObject & Document;

@Schema()
export class HeyamaObject {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageKey: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const HeyamaObjectSchema = SchemaFactory.createForClass(HeyamaObject);

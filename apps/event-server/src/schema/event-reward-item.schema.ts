import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EventRewardItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string; // 예: 'item', 'coupon', 'point' 등

  @Prop()
  description?: string;
}

export const EventRewardItemSchema =
  SchemaFactory.createForClass(EventRewardItem);
export type EventRewardItemDocument = EventRewardItem & Document;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  conditionDescription: string;

  @Prop({ required: true })
  startAt: Date;

  @Prop({ required: true })
  endAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  register: string; // 등록자 아이디 (예: userId)
}

export type EventDocument = Event & Document;
export const EventSchema = SchemaFactory.createForClass(Event);

export * from './event-reward-item.schema';
export * from './event-reward.schema';
export * from './event-goal-item.schema';
export * from './event-goal.schema';
export * from './user-goal-progress.schema';

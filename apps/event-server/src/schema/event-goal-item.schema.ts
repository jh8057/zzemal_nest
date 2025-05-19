import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EventGoalItem extends Document {
  @Prop({ required: true })
  conditionType: string; // 예: 'login', 'purchase', 'invite'

  @Prop({ required: true })
  targetValue: number; // 목표 수치 (ex: 5회 구매, 3회 로그인 등)

  @Prop()
  description?: string; // 설명 (선택)
}

export const EventGoalItemSchema = SchemaFactory.createForClass(EventGoalItem);
export type EventGoalItemDocument = EventGoalItem & Document;

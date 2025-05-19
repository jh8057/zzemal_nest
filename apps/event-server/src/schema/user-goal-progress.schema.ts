import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserGoalProgress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'EventGoalItem', required: true })
  goalItemId: Types.ObjectId;

  @Prop({ default: 0 })
  progressCount: number; // 진행 카운트 (ex: 구매 횟수)
}

export const UserGoalProgressSchema =
  SchemaFactory.createForClass(UserGoalProgress);
export type UserGoalProgressDocument = UserGoalProgress & Document;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true }) // createdAt, updatedAt 자동 포함
export class RewardRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected';

  @Prop()
  reason?: string; // 실패 시 사유 등
}

export type RewardRequestDocument = RewardRequest & Document;
export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);

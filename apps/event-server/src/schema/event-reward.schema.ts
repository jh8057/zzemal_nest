import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class EventReward extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RewardItem', required: true })
  rewardItemId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;
}

export const EventRewardSchema = SchemaFactory.createForClass(EventReward);
export type EventRewardDocument = EventReward & Document;

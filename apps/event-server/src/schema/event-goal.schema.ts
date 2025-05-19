import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class EventGoal extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'EventGoalItem' }],
    required: true,
  })
  goalItems: Types.ObjectId[];
}

export const EventGoalSchema = SchemaFactory.createForClass(EventGoal);
export type EventGoalModelDocument = EventGoal & Document;

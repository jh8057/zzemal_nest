import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import {
  Event,
  EventSchema,
  EventRewardItem,
  EventRewardItemSchema,
  EventReward,
  EventRewardSchema,
  EventGoalItem,
  EventGoalItemSchema,
  EventGoal,
  EventGoalSchema,
  UserGoalProgress,
  UserGoalProgressSchema,
} from '../schema/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventRewardItem.name, schema: EventRewardItemSchema },
      { name: EventReward.name, schema: EventRewardSchema },
      { name: EventGoalItem.name, schema: EventGoalItemSchema },
      { name: EventGoal.name, schema: EventGoalSchema },
      { name: UserGoalProgress.name, schema: UserGoalProgressSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { RewardRequest, RewardRequestSchema } from '../schema/reward.schema';
import {
  Event,
  EventSchema,
  EventGoal,
  EventGoalSchema,
} from '../schema/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: Event.name, schema: EventSchema },
      { name: EventGoal.name, schema: EventGoalSchema },
    ]),
  ],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}

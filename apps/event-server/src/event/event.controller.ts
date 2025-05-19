import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventService } from './event.service';
import {
  CreateEventDto,
  CreateRewardDto,
  CreateGoalDto,
} from '@common/dto/event';
import { validateDto } from '@common/dto/validate-dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern('event')
  async handleEvent(@Payload() data: { action: string; payload: any }) {
    const { action, payload } = data;

    switch (action) {
      case 'create_event': {
        console.log('start-create-evnt');
        const result = await validateDto(CreateEventDto, payload);
        if (!result.valid) return result;
        return this.eventService.createEvent(result.data);
      }

      case 'get_events':
        return this.eventService.getEvents();

      case 'add_rewards': {
        const result = await validateDto(CreateRewardDto, payload);
        if (!result.valid) return result;
        return this.eventService.addRewards(result.data);
      }

      case 'get_reward_items':
        return this.eventService.getRewardItems();
      case 'get_rewards':
        return this.eventService.getRewards(payload.eventId);
      case 'add_goals': {
        const result = await validateDto(CreateGoalDto, payload);
        if (!result.valid) return result;
        return this.eventService.addGoals(result.data);
      }
      case 'get_goal_items':
        return this.eventService.getGoalItems();
      case 'get_goals':
        return this.eventService.getGoals(payload.eventId);

      case 'increment_purchase': {
        const { userId } = payload;
        if (!userId) {
          return { error: 'userId is required' };
        }
        return this.eventService.incrementUserPurchase(userId);
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
}

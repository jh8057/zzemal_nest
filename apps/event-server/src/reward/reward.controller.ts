import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  RewardRequestDto,
  RewardMyRequestDto,
  RewardRequestFilterDto,
} from '@common/dto/reward';
import { RewardService } from './reward.service';
import { validateDto } from '@common/dto/validate-dto';

@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @MessagePattern('reward')
  async handleRewardMessage(@Payload() message: any) {
    const { action, payload } = message;

    switch (action) {
      case 'request_reward': {
        const result = await validateDto(RewardRequestDto, payload);
        if (!result.valid) return result;
        return this.rewardService.requestReward(result.data);
      }

      case 'get_all_reward_requests': {
        const result = await validateDto(RewardRequestFilterDto, payload);
        if (!result.valid) return result;
        return this.rewardService.getAllRequests(result.data);
      }

      case 'get_my_reward_requests': {
        const result = await validateDto(RewardMyRequestDto, payload);
        if (!result.valid) return result;
        return this.rewardService.getMyRequests(result.data.userId);
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
}

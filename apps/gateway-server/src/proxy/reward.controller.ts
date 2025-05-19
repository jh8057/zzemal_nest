import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import {
  RewardRequestDto,
  RewardMyRequestDto,
  RewardRequestFilterDto,
} from '@common/dto/reward';
import { JwtDto } from '@common/dto/jwt.dto';
import { CurrentUser } from '../auth/jwt/jwt-user.decorator';

@ApiTags('Reward')
@Controller('rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardController {
  constructor(
    @Inject('EVENT_SERVICE') private readonly rewardClient: ClientProxy,
  ) {}

  private async sendToReward<T>(action: string, payload: any): Promise<T> {
    return this.rewardClient
      .send('reward', { action, payload })
      .toPromise() as Promise<T>;
  }

  @Roles('user')
  @Post('request')
  @ApiTags('Reward')
  @ApiOperation({ summary: '보상 요청 (유저)' })
  @ApiBody({
    description: '보상 요청 데이터',
    examples: {
      default: {
        summary: '보상 요청 예시',
        value: {
          eventId: '664bced0fd44d1f12423a111', // MongoDB ObjectId 형식
        },
      },
    },
  })
  async requestReward(@Body() body: any, @CurrentUser() user: JwtDto) {
    return this.sendToReward('request_reward', {
      eventId: body.eventId,
      userId: user.userId,
    });
  }

  @Roles('operator', 'admin', 'auditor')
  @Get('requests')
  @ApiOperation({ summary: '전체 보상 요청 이력 조회 (관리자)' })
  @ApiResponse({ status: 200, description: '보상 이력 반환' })
  async getAllRewardRequests(@Query() filterDto: RewardRequestFilterDto) {
    return this.sendToReward('get_all_reward_requests', filterDto);
  }

  @Roles('user')
  @Get('requests/me')
  @ApiOperation({ summary: '내 보상 요청 이력 조회' })
  @ApiResponse({ status: 200, description: '내 보상 이력 반환' })
  async getMyRequests(@CurrentUser() user: JwtDto) {
    const dto: RewardMyRequestDto = { userId: user.userId };
    return this.sendToReward('get_my_reward_requests', dto);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import {
  CreateEventDto,
  CreateRewardDto,
  CreateGoalDto,
  EventRewardItem,
  CreateGoalItem,
} from '@common/dto/event';

import { JwtDto } from '@common/dto/jwt.dto';
import { CurrentUser } from '../auth/jwt/jwt-user.decorator';

@ApiTags('Event')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
  ) {}

  private async sendToEvent<T>(action: string, payload: any): Promise<T> {
    return this.eventClient
      .send('event', { action, payload })
      .toPromise() as Promise<T>;
  }

  @Roles('operator', 'admin')
  @Post()
  @ApiOperation({ summary: '이벤트 생성' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: '이벤트 생성 완료' })
  async createEvent(@Body() body: any, @CurrentUser() user: JwtDto) {
    return this.sendToEvent('create_event', {
      ...body,
      register: user.userId,
    } as CreateEventDto);
  }

  @Roles('operator', 'admin')
  @Get()
  @ApiOperation({ summary: '이벤트 목록 조회' })
  @ApiResponse({ status: 200, description: '이벤트 목록 반환' })
  async findAllEvents() {
    return this.sendToEvent('get_events', {});
  }

  @Roles('operator', 'admin')
  @Get('reward-items')
  @ApiOperation({ summary: '보상 아이템 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '보상 아이템 목록 반환',
    type: [EventRewardItem],
  })
  async getRewardItems(): Promise<EventRewardItem[]> {
    return this.sendToEvent('get_reward_items', {});
  }

  @Roles('operator', 'admin')
  @Post('rewards')
  @ApiOperation({ summary: '보상 추가' })
  @ApiBody({ type: CreateRewardDto })
  @ApiResponse({ status: 201, description: '보상 추가 완료' })
  async addRewards(@Body() dto: CreateRewardDto) {
    return this.sendToEvent('add_rewards', dto);
  }

  @Roles('operator', 'admin')
  @Get('rewards/:id')
  @ApiOperation({ summary: '보상 조회' })
  @ApiParam({ name: 'id', description: '이벤트 ID' })
  @ApiResponse({ status: 200, description: '보상 목록 반환' })
  async getRewards(@Param('id') eventId: string) {
    return this.sendToEvent('get_rewards', { eventId });
  }

  @Roles('operator', 'admin')
  @Post('goals')
  @ApiOperation({ summary: '목표 추가' })
  @ApiBody({ type: CreateGoalDto })
  @ApiResponse({ status: 201, description: '목표 추가 완료' })
  async addGoals(@Body() dto: CreateGoalDto) {
    return this.sendToEvent('add_goals', dto);
  }

  @Roles('operator', 'admin')
  @Get('goal-items')
  @ApiOperation({ summary: '목표 아이템 목록 조회' })
  @ApiResponse({ type: [CreateGoalItem] })
  async getGoalItems(): Promise<CreateGoalItem[]> {
    return this.sendToEvent('get_goal_items', {});
  }

  @Roles('operator', 'admin')
  @Get('goals')
  @ApiOperation({ summary: '이벤트 목표 목록 조회' })
  @ApiResponse({ type: [CreateGoalDto] })
  async getGoals(@Query('eventId') eventId: string): Promise<CreateGoalDto[]> {
    return this.sendToEvent('get_goals', { eventId });
  }

  @Roles('user')
  @Post('increment-purchase')
  @ApiOperation({ summary: '사용자 구매 횟수 증가' })
  @ApiBody({
    schema: {
      properties: { userId: { type: 'string' } },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 200, description: '구매 횟수 증가 완료' })
  async incrementPurchase(@Body() body: { userId: string }) {
    if (!body.userId) {
      return { error: 'userId is required' };
    }
    return this.sendToEvent('increment_purchase', { userId: body.userId });
  }
}

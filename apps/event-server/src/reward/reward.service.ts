import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Event,
  EventDocument,
  EventGoal,
  EventGoalModelDocument,
} from '../schema/event.schema';
import { RewardRequest, RewardRequestDocument } from '../schema/reward.schema';
import { RewardRequestDto, RewardRequestFilterDto } from '@common/dto/reward';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(EventGoal.name)
    private eventGoalModel: Model<EventGoalModelDocument>,
  ) {}

  /** 보상 요청 */
  async requestReward(dto: RewardRequestDto) {
    const { userId, eventId } = dto;

    // 이벤트 존재 여부 확인
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // 중복 요청 확인 (pending, approved 상태인 경우)
    const existing = await this.rewardRequestModel
      .findOne({ userId, eventId })
      .where('status')
      .in(['pending', 'approved'])
      .exec();

    if (existing) {
      throw new BadRequestException('이미 요청한 이벤트입니다');
    }

    // 이벤트 목표(goal) 확인
    const goalList = await this.eventGoalModel.find({ eventId });
    if (!goalList.length) {
      throw new NotFoundException('Event goals not found');
    }

    // TODO: 실제 조건 검증 로직으로 대체 필요
    const allGoalsCompleted = goalList.every((goal) => {
      // goal.type 에 따라 유저의 행동 로그와 비교하는 로직 필요
      return true; // 현재는 임시로 true 처리
    });

    const status = allGoalsCompleted ? 'approved' : 'rejected';

    const request = new this.rewardRequestModel({
      userId,
      eventId,
      status,
    });

    return request.save();
  }

  /** 나의 보상 요청 내역 조회 */
  async getMyRequests(userId: string) {
    return this.rewardRequestModel.find({ userId }).exec();
  }

  /** 모든 보상 요청 내역 조회 (관리자) */
  async getAllRequests(dto: RewardRequestFilterDto) {
    const filter: Record<string, any> = {};

    if (dto.eventId) {
      filter.eventId = dto.eventId;
    }
    if (dto.status) {
      filter.status = dto.status;
    }
    if (dto.userId) {
      filter.userId = dto.userId;
    }

    return this.rewardRequestModel.find(filter).exec();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Event,
  EventRewardItem,
  EventReward,
  EventGoalItem,
  EventGoal,
  EventDocument,
  EventRewardItemDocument,
  EventRewardDocument,
  EventGoalItemDocument,
  EventGoalModelDocument,
} from '../schema/event.schema';
import {
  CreateEventDto,
  CreateRewardDto,
  CreateGoalDto,
} from '@common/dto/event';
import {
  UserGoalProgress,
  UserGoalProgressDocument,
} from '../schema/user-goal-progress.schema';
@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(EventRewardItem.name)
    private rewardItemModel: Model<EventRewardItemDocument>,
    @InjectModel(EventReward.name)
    private eventRewardModel: Model<EventRewardDocument>,
    @InjectModel(EventGoalItem.name)
    private eventGoalItemModel: Model<EventGoalItemDocument>,
    @InjectModel(EventGoal.name)
    private eventGoalModel: Model<EventGoalModelDocument>,
    @InjectModel(UserGoalProgress.name)
    private userGoalProgressModel: Model<UserGoalProgressDocument>,
  ) {}

  /** 이벤트 생성 */
  async createEvent(dto: CreateEventDto): Promise<Event> {
    const event = new this.eventModel(dto);
    return event.save();
  }

  /** 이벤트 조회 */
  async getEvents(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  /** 이벤트 보상 등록 */
  async addRewards(dto: CreateRewardDto) {
    const event = await this.eventModel.findById(dto.eventId);
    if (!event) throw new NotFoundException('Event not found');

    const rewardItem = await this.rewardItemModel.findById(
      dto.reward.rewardItemId,
    );
    if (!rewardItem) throw new NotFoundException('RewardItem not found');

    const eventReward = new this.eventRewardModel({
      eventId: event._id,
      rewardItemId: rewardItem._id,
      quantity: dto.reward.quantity,
    });

    return eventReward.save();
  }
  /** 보상 아이템 목록 조회 */
  async getRewardItems(): Promise<EventRewardItem[]> {
    return this.rewardItemModel.find().exec();
  }

  /** 이벤트 보상 조회 */
  async getRewards(eventId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new NotFoundException('Event not found');

    return this.eventRewardModel.find({ eventId: event._id }).exec();
  }

  /** 목표 아이템 목록 조회 */
  async getGoalItems(): Promise<EventGoalItem[]> {
    return this.eventGoalItemModel.find().exec();
  }

  /** 이벤트 달성 조건 등록 */
  async addGoals(dto: CreateGoalDto) {
    const event = await this.eventModel.findById(dto.eventId);
    if (!event) throw new NotFoundException('Event not found');

    const goalItem = await this.eventGoalItemModel.findById(dto.goalItemId);
    if (!goalItem) throw new NotFoundException('Goal item not found');

    const goal = new this.eventGoalModel({
      eventId: dto.eventId,
      goalItems: [goalItem._id],
    });

    return goal.save();
  }

  /** 이벤트 달성 조건 조회 */
  async getGoals(eventId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new NotFoundException('Event not found');

    const goals = await this.eventGoalModel.find({ eventId }).exec();

    return goals;
  }

  /** '아이템 구매' 목표 아이템 증가 */
  async incrementUserPurchase(userId: string): Promise<UserGoalProgress> {
    const goalItem = await this.eventGoalItemModel.findOne({
      conditionType: 'purchase_count',
    });
    if (!goalItem) throw new NotFoundException('Goal item not found');

    const userGoal = await this.userGoalProgressModel.findOne({
      userId: new Types.ObjectId(userId),
      goalItemId: goalItem._id,
    });

    if (!userGoal) {
      // 기록이 없으면 새로 생성 (count=1)
      const newProgress = new this.userGoalProgressModel({
        userId: new Types.ObjectId(userId),
        goalItemId: goalItem._id,
        progressCount: 1,
      });
      return newProgress.save();
    }

    userGoal.progressCount += 1;
    return userGoal.save();
  }
}

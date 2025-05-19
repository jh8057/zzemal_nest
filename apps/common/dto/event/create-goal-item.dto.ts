import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum GoalConditionType {
  PURCHASE_COUNT = 'purchase_count',
  LOGIN_COUNT = 'login_count',
  // 필요시 다른 조건 타입 추가
}

export class CreateGoalItem {
  @ApiProperty({ description: '목표 이름', example: '상품 3회 구매' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '조건 타입',
    example: 'purchase_count',
    enum: GoalConditionType,
  })
  @IsEnum(GoalConditionType)
  conditionType: GoalConditionType;

  @ApiProperty({ description: '목표 달성 기준 수치', example: 3 })
  @IsNumber()
  targetCount: number;

  @ApiProperty({
    description: '설명',
    required: false,
    example: '특정 상품 3회 구매 시 달성',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

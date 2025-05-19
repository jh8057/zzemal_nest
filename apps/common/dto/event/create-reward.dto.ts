import { IsMongoId, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class RewardInput {
  @ApiProperty({
    description: '리워드 아이템 ID (Mongo ObjectId 형식)',
    example: '647f9e0d5f3c3b1f8c8e4d4a',
  })
  @IsMongoId()
  rewardItemId: string;

  @ApiProperty({
    description: '리워드 수량 (1 이상)',
    example: 3,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateRewardDto {
  @ApiProperty({
    description: '이벤트 ID (Mongo ObjectId 형식)',
    example: '647f9e0d5f3c3b1f8c8e4d4a',
  })
  @IsMongoId()
  eventId: string;

  @ApiProperty({
    description: '리워드 정보',
    type: RewardInput,
  })
  @ValidateNested()
  @Type(() => RewardInput)
  reward: RewardInput;
}

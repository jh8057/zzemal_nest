import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EventRewardItem {
  @ApiProperty({ description: '보상 아이템 이름' })
  name: string;

  @ApiProperty({
    description: '보상 아이템 타입',
    example: 'item | coupon | point',
  })
  type: string;

  @ApiPropertyOptional({ description: '보상 아이템 설명', nullable: true })
  description?: string;
}

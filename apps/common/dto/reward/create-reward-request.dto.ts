import { IsMongoId, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardRequestDto {
  @ApiProperty({
    description: '이벤트 ID (Mongo ObjectId 형식)',
    example: '647f9e0d5f3c3b1f8c8e4d4a',
  })
  @IsMongoId()
  eventId: string;

  @ApiProperty({
    description: '이벤트 리워드 ID (Mongo ObjectId 형식)',
    example: '6480f1a65f3c3b1f8c8e4d50',
  })
  @IsMongoId()
  eventRewardId: string;

  @ApiProperty({
    description: '요청 수량 (1 이상)',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

import { IsMongoId, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RewardRequestFilterDto {
  @ApiPropertyOptional({
    description: '이벤트 ID (Mongo ObjectId 형식)',
    example: '647f9e0d5f3c3b1f8c8e4d4a',
  })
  @IsOptional()
  @IsMongoId()
  eventId?: string;

  @ApiPropertyOptional({
    description: '리워드 요청 상태',
    enum: ['pending', 'approved', 'rejected'],
    example: 'pending',
  })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: 'pending' | 'approved' | 'rejected';

  @ApiPropertyOptional({
    description: '사용자 ID (Mongo ObjectId 형식)',
    example: '6480f1a65f3c3b1f8c8e4d50',
  })
  @IsOptional()
  @IsMongoId()
  userId?: string;
}

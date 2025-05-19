import { IsMongoId, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RewardRequestDto {
  @ApiProperty({
    description: '이벤트 ID (Mongo ObjectId 형식)',
    example: '647f9e0d5f3c3b1f8c8e4d4a',
  })
  @IsMongoId()
  eventId: string;

  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  userId: string;
}

export class RewardMyRequestDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'user@nexon.com',
  })
  @IsString()
  userId: string;
}

import {
  IsString,
  IsDateString,
  IsBoolean,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: '이벤트 제목',
    example: '이벤트 제목 예시',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '이벤트 조건 설명',
    example: '로그인 3일, 친구 초대 등',
    required: false,
  })
  @IsOptional()
  @IsString()
  conditionDescription?: string;

  @ApiProperty({
    description: '이벤트 시작 날짜 (ISO 8601 형식)',
    example: '2025-05-20T09:00:00Z',
  })
  @IsDateString()
  startAt: string;

  @ApiProperty({
    description: '이벤트 종료 날짜 (ISO 8601 형식)',
    example: '2025-05-22T18:00:00Z',
  })
  @IsDateString()
  endAt: string;

  @ApiProperty({
    description: '이벤트 활성 상태 여부',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: '이벤트 등록자 ID',
    example: 'operator@nexon.com',
  })
  @IsString()
  register: string;
}

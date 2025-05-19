import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: '6650b51ae6e38c57f7412345',
  })
  @IsMongoId()
  eventId: string;

  @ApiProperty({
    description: '목표 아이템 ID',
    example: '6650b6a3e6e38c57f7415678',
  })
  @IsMongoId()
  goalItemId: string;
}

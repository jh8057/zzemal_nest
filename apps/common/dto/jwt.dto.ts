// auth/dto/jwt.dto.ts
import { IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JwtDto {
  @ApiProperty({
    description: 'JWT userID',
    example: 'admin@nexon.com',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  userId: string;

  @ApiProperty({
    description: '사용자 권한',
    example: 'user',
  })
  @Matches(/^(user|operator|auditor|admin)$/, {
    message: '유효하지 않은 권한입니다.',
  })
  role: string;
}

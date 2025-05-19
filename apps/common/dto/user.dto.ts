// auth/dto/user.dto.ts
import { IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'admin@nexon.com',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({
    description: '비밀번호 (최소 8자 이상, 대소문자, 숫자, 특수문자 포함)',
    example: 'Abcd1234!',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/,
    {
      message:
        '비밀번호는 최소 8자 이상, 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
    },
  )
  password: string;
}

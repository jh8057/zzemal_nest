import { Controller, Post, Body, Res, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Public } from '../auth/jwt/jwt-public.decorator';
import { CurrentUser } from '../auth/jwt/jwt-user.decorator';

import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserDto } from '@common/dto/user.dto';
import { JwtDto } from '@common/dto/jwt.dto';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  private async sendToAuth<T>(action: string, payload: any): Promise<T> {
    return this.authClient
      .send('auth', { action, payload })
      .toPromise() as Promise<T>;
  }

  @Public()
  @Post('/user')
  @ApiOperation({ summary: '사용자 생성 요청' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 200, description: '성공 응답' })
  async createUser(@Body() body: UserDto, @Res() res: Response) {
    const result = await this.sendToAuth<{ token: string }>('user', body);
    res.status(200).json(result);
  }

  // @Public()
  @Roles('admin')
  @Post('/role')
  @ApiOperation({
    summary: '권한 변경',
    description: 'ID의 권한을 변경합니다.',
  })
  @ApiBody({ type: JwtDto })
  async changeRole(@Body() body: JwtDto, @Res() res: Response) {
    const result = await this.sendToAuth<{ token: string }>('role', body);
    res.status(200).json(result);
  }

  @Public()
  @Post('/login')
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인합니다.',
  })
  @ApiBody({ type: UserDto })
  async login(@Body() body: UserDto, @Res() res: Response) {
    const result = await this.sendToAuth<{ token: string }>('login', body);
    const { token } = result;
    if (!token) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
    });
  }

  @Public()
  @Post('/logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그인 token을 삭제합니다.',
  })
  async logout(@CurrentUser() user: JwtDto, @Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    res.status(200).json({
      message: 'logout successful',
    });
  }
}

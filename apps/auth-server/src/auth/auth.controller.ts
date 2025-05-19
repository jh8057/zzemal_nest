import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '@common/dto/user.dto';
import { validateDto } from '@common/dto/validate-dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('auth')
  async handleAuthMessage(@Payload() data: { action: string; payload: any }) {
    // 계정 생성
    const createUser = async () => {
      const userData = await validateDto(UserDto, data.payload);
      if (!userData.valid) {
        return userData;
      }
      const user = await this.authService.create(
        userData.data.email,
        userData.data.password,
      );
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }
      return { success: true, message: 'User created', user: userData.data };
    };

    // 로그인
    const login = async () => {
      const userData = await validateDto(UserDto, data.payload);
      if (!userData.valid) {
        return userData;
      }
      const user = await this.authService.validateUser(
        userData.data.email,
        userData.data.password,
      );
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      const token = await this.authService.login(user);
      return { success: true, message: 'Login successful', token };
    };

    // 권한 변경
    const changeRole = async () => {
      const { userId, role } = data.payload;

      const validRoles = ['user', 'operator', 'auditor', 'admin'];
      if (!validRoles.includes(role)) {
        return {
          success: false,
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
        };
      }

      await this.authService.updateRole(userId, role);

      return {
        success: true,
        message: 'Role changed successfully',
        userId,
        newRole: role,
      };
    };

    switch (data.action) {
      case 'user':
        return createUser();
      case 'login':
        return login();
      case 'role':
        return changeRole();
      default:
        return { success: false, message: 'Unknown action' };
    }
  }
}

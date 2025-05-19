import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /** 아이디 검색 (Email) */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /** 유저 ID 검색 */
  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** 유저 생성 */
  async create(email: string, plainPassword: string): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const createdUser = new this.userModel({ email, password: hashedPassword });
    return createdUser.save();
  }

  /** 유저 검증 */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  /** 로그인 (JWT 토큰 반환) */
  async login(user: any) {
    const payload = { userId: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      // refresh_token: this.jwtService.sign(payload, {
      //   expiresIn: '7d',
      // }),
    };
  }

  /** 유저 권한 변경 */
  async updateRole(userId: string, role: string): Promise<UserDocument> {
    const updated = await this.userModel.findOneAndUpdate(
      { email: userId },
      { role },
      { new: true },
    );
    if (!updated) {
      throw new UnauthorizedException('Role update failed');
    }
    return updated;
  }
}

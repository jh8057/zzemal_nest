// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Module({
  imports: [PassportModule], //ConfigModule
  providers: [
    JwtStrategy, // JwtStrategy를 providers에 등록
    {
      provide: APP_GUARD, // app.module에 등록되면 전역으로 선언됨
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}

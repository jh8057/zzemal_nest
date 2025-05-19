// app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInterceptor } from '@common/logger/http-logging.interceptor';
import { AuthController } from './proxy/auth.controller';
import { EventController } from './proxy/event.controller';
import { RewardController } from './proxy/reward.controller';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'auth-server', port: 3001 },
      },
      {
        name: 'EVENT_SERVICE',
        transport: Transport.TCP,
        options: { host: 'event-server', port: 3002 },
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    EventController,
    RewardController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
})
export class AppModule {}

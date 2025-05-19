import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { RewardModule } from './reward/reward.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    EventModule,
    RewardModule,
  ],
})
export class AppModule {}

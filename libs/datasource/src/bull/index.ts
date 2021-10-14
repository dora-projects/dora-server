import { BullModule } from '@nestjs/bull';
import { MyConfigModule } from 'libs/datasource/config';
import { ConfigService } from '@nestjs/config';

export const MyBullModule = BullModule.forRootAsync({
  imports: [MyConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      redis: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
    };
  },
  inject: [ConfigService],
});

export const EventBullQueueModule = BullModule.registerQueue({
  name: 'event',
});

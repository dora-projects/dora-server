import { BullModule } from '@nestjs/bull';
import { MyConfigModule } from 'libs/datasource/config';
import { ConfigService } from '@nestjs/config';
import {
  AlertQueueName,
  BullPrefix,
  EventQueueName,
} from 'libs/shared/constant';

export const MyBullModule = BullModule.forRootAsync({
  imports: [MyConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      prefix: BullPrefix,
      redis: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
    };
  },
  inject: [ConfigService],
});

// 注册事件队列
export const EventBullQueueModule = BullModule.registerQueue({
  name: EventQueueName,
});

// 注册告警队列
export const AlertBullQueueModule = BullModule.registerQueue({
  name: AlertQueueName,
});

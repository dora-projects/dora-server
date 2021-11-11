import { BullModule } from '@nestjs/bull';
import { MyConfigModule } from 'libs/datasource/config';
import { ConfigService } from '@nestjs/config';
import {
  BullPrefix,
  EventQueue,
  AlertQueue,
  IssueQueue,
} from 'libs/shared/constant';

export const MyBullModule = BullModule.forRootAsync({
  imports: [MyConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      prefix: BullPrefix,
      redis: {
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        password: configService.get('redis.password'),
      },
    };
  },
  inject: [ConfigService],
});

// 注册事件接收队列
export const EventBullQueueModule = BullModule.registerQueue({
  name: EventQueue,
});

// 注册告警队列
export const AlertBullQueueModule = BullModule.registerQueue({
  name: AlertQueue,
});

// 注册issue队列
export const IssueQueueModule = BullModule.registerQueue({
  name: IssueQueue,
});

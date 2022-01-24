import { BullModule } from '@nestjs/bull';
import { MyConfigModule } from 'libs/datasource/config';
import { ConfigService } from '@nestjs/config';
import { Queue_Alert, Queue_Event, Queue_Issue } from 'libs/shared/constant';

export const QueueModule = BullModule.forRootAsync({
  imports: [MyConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      redis: {
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        password: configService.get('redis.password'),
      },
      defaultJobOptions: {
        attempts: 3,
        timeout: 3 * 60 * 1000,
        removeOnComplete: true,
        removeOnFail: false,
      },
    };
  },
  inject: [ConfigService],
});

export const registerQueueEvent = BullModule.registerQueue({
  name: Queue_Event,
});

export const registerQueueIssue = BullModule.registerQueue({
  name: Queue_Issue,
});

export const registerQueueAlert = BullModule.registerQueue({
  name: Queue_Alert,
});

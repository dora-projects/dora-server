import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  ErrorEventQueueName,
  EventQueueName,
  PerfEventQueueName,
} from 'libs/shared/constant';

@Injectable()
export class ReceiverService {
  private readonly logger = new Logger(ReceiverService.name);

  constructor(
    @InjectQueue(EventQueueName) private readonly eventQueue: Queue,
  ) {}

  async verifyEvent(data: any): Promise<any> {
    // redis cache get project info
    return data;
  }

  // 错误数据
  async pushErrorEventToQueue(data): Promise<any> {
    try {
      const result = await this.verifyEvent(data);
      await this.eventQueue.add(ErrorEventQueueName, result, {
        removeOnComplete: true,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  // 性能数据
  async pushPerfEventToQueue(data): Promise<any> {
    try {
      const result = await this.verifyEvent(data);
      await this.eventQueue.add(PerfEventQueueName, result, {
        removeOnComplete: true,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}

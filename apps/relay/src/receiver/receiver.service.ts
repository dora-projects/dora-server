import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ReceiverService {
  private readonly logger = new Logger(ReceiverService.name);

  constructor(@InjectQueue('event') private readonly eventQueue: Queue) {}

  async verifyEvent(data: any): Promise<any> {
    // redis cache get project info
    return data;
  }

  // 错误数据
  async pushToErrorEventQueue(data): Promise<any> {
    try {
      const result = await this.verifyEvent(data);
      await this.eventQueue.add('event-error', result, {
        removeOnComplete: true,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  // 性能数据
  async pushToPerfEventQueue(data): Promise<any> {
    try {
      const result = await this.verifyEvent(data);
      await this.eventQueue.add('event-pref', result, {
        removeOnComplete: true,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Queue_Alert, Queue_Event, Queue_Issue } from 'libs/shared/constant';

@Injectable()
export class SystemService {
  constructor(
    @InjectQueue(Queue_Event) private readonly eventQueue: Queue,
    @InjectQueue(Queue_Alert) private readonly alertQueue: Queue,
    @InjectQueue(Queue_Issue) private readonly issueQueue: Queue,
  ) {}

  // 获取队列统计数值
  async getJobCounts(): Promise<any> {
    const eventQueue = await this.eventQueue.getJobCounts();
    const alertQueue = await this.alertQueue.getJobCounts();
    const issueQueue = await this.issueQueue.getJobCounts();

    return {
      [Queue_Event]: eventQueue,
      [Queue_Alert]: alertQueue,
      [Queue_Issue]: issueQueue,
    };
  }
}

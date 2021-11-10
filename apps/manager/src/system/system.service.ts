import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';
import { AlertQueue, EventQueue, IssueQueue } from 'libs/shared/constant';

@Injectable()
export class SystemService {
  constructor(
    @InjectQueue(EventQueue) private readonly eventQueue: Queue,
    @InjectQueue(AlertQueue) private readonly alertQueue: Queue,
    @InjectQueue(IssueQueue) private readonly issueQueue: Queue,
  ) {}

  // 获取队列统计数值
  async getJobCounts(): Promise<any> {
    const eventQueue = await this.eventQueue.getJobCounts();
    const alertQueue = await this.alertQueue.getJobCounts();
    const issueQueue = await this.issueQueue.getJobCounts();
    return { eventQueue, alertQueue, issueQueue };
  }
}

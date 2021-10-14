import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';

@Injectable()
export class SystemService {
  constructor(@InjectQueue('event') private readonly eventQueue: Queue) {}

  // 获取队列 jobs
  async getJobs(): Promise<Bull.Job<any>[]> {
    return await this.eventQueue.getJobs([
      // 'completed',
      'waiting',
      'active',
      'delayed',
      'failed',
      'paused',
    ]);
  }

  // 获取队列统计数值
  async getJobCounts(): Promise<Bull.JobCounts> {
    return await this.eventQueue.getJobCounts();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';

@Injectable()
export class ReportService {
  constructor(@InjectQueue('event') private readonly eventQueue: Queue) {}

  /**
   * 处理 event
   */
  async handleEvent(data, ip: string): Promise<any> {
    // todo ip
    // 增加 ua parser
    console.log('ip', ip);
    await this.pushEventToQueue(data);
  }

  /**
   * 把 event 放到队列
   */
  async pushEventToQueue(data): Promise<any> {
    return await this.eventQueue.add('event-report', data);
  }

  /**
   * 获取队列 jobs
   */
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

  /**
   * 获取队列统计数值
   */
  async getJobCounts(): Promise<Bull.JobCounts> {
    return await this.eventQueue.getJobCounts();
  }
}

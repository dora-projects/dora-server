import { InjectQueue, OnGlobalQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { throttle } from 'lodash';
import * as dayjs from 'dayjs';
import { Queue, Job } from 'bull';

@Processor('event')
export class IssuesProcessor {
  constructor(@InjectQueue('event') private readonly eventQueue: Queue) {}

  private readonly logger = new Logger(IssuesProcessor.name);

  private async checkAlertRules(job: Job<any>) {
    this.logger.log('job', job?.data);
    this.logger.log('checkAlertRules', dayjs().format());
  }

  // 节流耗时操作
  public throttleCheckAlertRules = throttle(this.checkAlertRules, 5000);

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number) {
    try {
      const job = await this.eventQueue.getJob(jobId);
      await this.throttleCheckAlertRules(job);
    } catch (e) {
      this.logger.error(e);
    }
  }
}

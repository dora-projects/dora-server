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
    console.log('job', job?.data);
    console.log('checkAlertRules', dayjs().format());
  }

  /**
   *  耗时操作 需节流
   */
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

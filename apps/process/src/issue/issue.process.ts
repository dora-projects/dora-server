import { Logger } from '@nestjs/common';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { IssueService } from './issue.service';

import { Queue_Issue } from 'libs/shared/constant';

@Processor(Queue_Issue)
export class IssueProcess {
  constructor(private readonly issueService: IssueService) {}

  private readonly logger = new Logger(IssueProcess.name);

  @Process()
  async issueMessage(job: Job<unknown>) {
    try {
      const event = job?.data;
      if (!event) return;
      await this.issueService.createIssueIfNotExist(event);
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }
}

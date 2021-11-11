import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { IssueQueue } from 'libs/shared/constant';
import { IssueService } from './issue.service';
import { dumpJson } from 'libs/shared';

@Processor(IssueQueue)
export class IssueProcessor {
  constructor(private readonly issueService: IssueService) {}

  private readonly logger = new Logger(IssueProcessor.name);

  @Process()
  async handleIssueCreateMessage(job: Job) {
    try {
      this.logger.debug('IssueProcessor got error data!');
      const event = job.data;
      await this.issueService.createIssueIfNotExist(event);
      // await dumpJson('Issue_', job);
    } catch (e) {
      this.logger.error(e);
      await job.moveToFailed({ message: e?.message }, true);
    }
  }
}
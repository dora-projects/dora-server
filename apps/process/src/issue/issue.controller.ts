import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { IssueService } from './issue.service';
import { Event_Issue } from 'libs/shared/constant';

@Controller()
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  private readonly logger = new Logger(IssueController.name);

  @EventPattern(Event_Issue)
  async issueMessage(data: Record<string, unknown>) {
    try {
      const event = data?.value;
      if (!event) return;
      await this.issueService.createIssueIfNotExist(event);
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }
}

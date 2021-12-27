import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IssueService } from './issue.service';
import { Message_Issue } from 'libs/shared/constant';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';

@Controller()
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  private readonly logger = new Logger(IssueController.name);

  @MessagePattern(Message_Issue)
  async issueMessage(@Payload() message: KafkaMessage) {
    try {
      const event = message.value;
      await this.issueService.createIssueIfNotExist(event);
      // await dumpJson('Issue_', job);
    } catch (e) {
      return e;
    }
  }
}

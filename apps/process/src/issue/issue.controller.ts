import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { IssueService } from './issue.service';
import { KAFKA_SERVICE } from 'libs/datasource/kafka';
import { Message_Issue } from 'libs/shared/constant';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';

@Controller()
export class IssueController implements OnModuleInit {
  private readonly logger = new Logger(IssueController.name);

  constructor(
    private readonly issueService: IssueService,
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(KAFKA_SERVICE)
    private clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf(Message_Issue);
    await this.clientKafka.connect();
  }

  @MessagePattern(Message_Issue)
  async issueMessage(@Payload() message: KafkaMessage) {
    try {
      const event = message.value;
      await this.issueService.createIssueIfNotExist(event);
      // await dumpJson('Issue_', job);
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }
}

import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EventService } from './event.service';
import { KAFKA_SERVICE } from 'libs/datasource/kafka';
import {
  ElasticIndexOfError,
  ElasticIndexOfPerf,
  Message_Alert,
  Message_Error,
  Message_Issue,
  Message_Perf,
} from 'libs/shared/constant';
import {
  KafkaMessage,
  Producer,
} from '@nestjs/microservices/external/kafka.interface';

@Controller()
export class EventController implements OnModuleInit {
  private readonly logger = new Logger(EventController.name);

  private kafkaProducer: Producer;

  constructor(
    private readonly eventService: EventService,
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(KAFKA_SERVICE)
    private clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    const topics = [Message_Error, Message_Perf];
    topics.forEach((topic) => {
      this.clientKafka.subscribeToResponseOf(topic);
    });

    this.kafkaProducer = await this.clientKafka.connect();
  }

  // 错误消息
  @MessagePattern(Message_Error)
  async handleErrorMessage(@Payload() message: KafkaMessage) {
    const data = message.value;
    try {
      // step1: 聚合
      const resultStep1 = await this.eventService.aggregationError(data);

      // step2: uaParser
      const resultStep2 = await this.eventService.userAgentParser(resultStep1);

      // step3: 保存
      await this.eventService.batchSaveDocs(ElasticIndexOfError, resultStep2);

      // step4: 发送给告警 和 Issue
      await this.sendAlertQueue(resultStep2);
      await this.sendIssueQueue(resultStep2);

      // if (__DEV__) {
      //   await dumpJson('error', resultStep2);
      // }
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }

  // 性能消息
  @MessagePattern(Message_Perf)
  async handlePerfMessage(@Payload() message: KafkaMessage) {
    const data = message.value;
    try {
      // step1: uaParser
      const resultStep1 = await this.eventService.userAgentParser(data);

      // step2: 保存
      await this.eventService.batchSaveDocs(ElasticIndexOfPerf, resultStep1);

      // if (__DEV__) {
      //   await dumpJson('perf', resultStep1);
      // }
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }

  // 发送给告警队列
  async sendAlertQueue(data: any): Promise<void> {
    await this.kafkaProducer.send({
      topic: Message_Alert,
      messages: [{ key: Message_Alert, value: JSON.stringify(data) }],
    });
  }

  // 发送issue队列
  async sendIssueQueue(data: any): Promise<void> {
    await this.kafkaProducer.send({
      topic: Message_Issue,
      messages: [{ key: Message_Issue, value: JSON.stringify(data) }],
    });
  }
}

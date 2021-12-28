import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EventService } from './event.service';
import { KAFKA_SERVICE } from 'libs/datasource/kafka';
import {
  ElasticIndexOfError,
  ElasticIndexOfPerf,
  Event_Alert,
  Event_Issue,
  Message_Error,
  Message_Perf,
} from 'libs/shared/constant';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';

@Controller()
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(KAFKA_SERVICE)
    private client: ClientKafka,
  ) {}

  private readonly logger = new Logger(EventController.name);

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
      this.sendAlertQueue(resultStep2);
      this.sendIssueQueue(resultStep2);

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

  // 通知告警
  sendAlertQueue(data: any) {
    this.client.emit(Event_Alert, data);
  }

  // 通知issue
  sendIssueQueue(data: any) {
    this.client.emit(Event_Issue, data);
  }
}

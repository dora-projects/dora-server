import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  ElasticIndexOfError,
  ElasticIndexOfPerf,
  ErrorEventQueueName,
  EventQueue,
  PerfEventQueueName,
} from 'libs/shared/constant';
import { EventService } from './event.service';
import { __DEV__, dumpJson } from 'libs/shared';

@Processor(EventQueue)
export class EventProcessor {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly eventService: EventService,
  ) {}

  private readonly logger = new Logger(EventProcessor.name);

  // 错误消息
  @Process(ErrorEventQueueName)
  async handleErrorMessage(job: Job) {
    const data = job.data;
    try {
      // step1: 聚合
      const resultStep1 = await this.eventService.aggregationError(data);

      // step2: uaParser
      const resultStep2 = await this.eventService.userAgentParser(resultStep1);

      // step3: 保存
      await this.eventService.batchSaveDocs(ElasticIndexOfError, resultStep2);

      // step4: 发送给告警 和 Issue
      await this.eventService.sendAlertQueue(resultStep2);
      await this.eventService.sendIssueQueue(resultStep2);

      // if (__DEV__) {
      //   await dumpJson('error', resultStep2);
      // }
    } catch (e) {
      this.logger.error(e, e?.stack);
      await job.moveToFailed({ message: e?.message }, true);
    }
  }

  // 性能消息
  @Process(PerfEventQueueName)
  async handlePerfMessage(job: Job) {
    const data = job.data;
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
      await job.moveToFailed({ message: e?.message }, true);
    }
  }
}

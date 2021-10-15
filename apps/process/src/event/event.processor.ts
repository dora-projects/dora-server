import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  ElasticIndexOfError,
  ElasticIndexOfPref,
  ErrorEventQueueName,
  EventQueueName,
  PerfEventQueueName,
} from 'libs/shared/constant';
import { EventService } from './event.service';

@Processor(EventQueueName)
export class EventProcessor {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly eventService: EventService,
  ) {}

  private readonly logger = new Logger(EventProcessor.name);

  // 错误消息
  @Process(ErrorEventQueueName)
  async handleErrorMessage(job: Job) {
    this.logger.debug('EventProcessor got error data');
    const data = job.data;
    try {
      // step1: 聚合
      const resultStep1 = await this.eventService.aggregationError(data);

      // step2: uaParser
      const resultStep2 = await this.eventService.aggregationError(resultStep1);

      // step3: 保存
      const res = await this.elasticsearchService.index({
        index: ElasticIndexOfPref,
        body: resultStep2,
      });

      // step4: 发送给告警
      await this.eventService.sendAlertQueue(resultStep2);

      this.logger.debug(
        `Elasticsearch save ${ElasticIndexOfPref} status:${res.statusCode}`,
      );
    } catch (e) {
      this.logger.error(e);
      await job.moveToFailed({ message: e?.message }, true);
    }
  }

  // 性能消息
  @Process(PerfEventQueueName)
  async handlePrefMessage(job: Job) {
    this.logger.debug('EventProcessor got perf data');
    const data = job.data;
    try {
      // step1: uaParser
      const resultStep1 = await this.eventService.aggregationError(data);

      // step2: 保存
      const res = await this.elasticsearchService.index({
        index: ElasticIndexOfError,
        body: resultStep1,
      });

      this.logger.debug(
        `Elasticsearch save ${ElasticIndexOfError} status:${res.statusCode}`,
      );
    } catch (e) {
      this.logger.error(e);
      await job.moveToFailed({ message: e?.message }, true);
    }
  }
}

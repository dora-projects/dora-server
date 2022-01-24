import { Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';

import {
  ElasticIndexOfError,
  ElasticIndexOfPerf,
  Event_Perf,
  Event_Error,
} from 'libs/shared/constant';
import { EventService } from './event.service';
import { Queue_Alert, Queue_Event, Queue_Issue } from 'libs/shared/constant';

@Processor(Queue_Event)
export class EventProcess {
  constructor(
    private readonly eventService: EventService,
    private readonly elasticsearchService: ElasticsearchService,
    @InjectQueue(Queue_Issue) private queueIssue: Queue,
    @InjectQueue(Queue_Alert) private queueAlert: Queue,
  ) {}

  private readonly logger = new Logger(EventProcess.name);

  // 错误消息
  @Process({ name: Event_Error })
  async handleErrorMessage(job: Job<unknown>) {
    const data = job.data;
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
  @Process({ name: Event_Perf })
  async handlePerfMessage(job: Job<unknown>) {
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
    }
  }

  // 通知告警
  async sendAlertQueue(data: any) {
    await this.queueAlert.add(data);
  }

  // 通知issue
  async sendIssueQueue(data: any) {
    await this.queueIssue.add(data);
  }
}

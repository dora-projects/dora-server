import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as lodash from 'lodash';
import { AlertQueue, IssueQueue } from 'libs/shared/constant';
import { sha256 } from 'libs/shared';
import { userAgentParser } from 'libs/shared/uaParser';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class EventService {
  constructor(
    @InjectQueue(AlertQueue) private readonly alertQueue: Queue,
    @InjectQueue(IssueQueue) private readonly issueQueue: Queue,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  private readonly logger = new Logger(EventService.name);

  // 记录上次插入的时间
  private esBatchInsertedLastTime: number = Date.now();
  private esBatchInsertedData: any[] = [];

  // 发送给告警队列
  async sendAlertQueue(data: any): Promise<void> {
    await this.alertQueue.add(data, {
      removeOnComplete: true,
    });
  }

  // 发送issue队列
  async sendIssueQueue(data: any): Promise<void> {
    await this.issueQueue.add(data, {
      removeOnComplete: true,
    });
  }

  // todo 聚合
  async aggregationError(data): Promise<any> {
    if (data?.exception) {
      data.fingerprint = sha256(JSON.stringify(data.exception));
    }
    return data;
  }

  // ua parser
  async userAgentParser(data): Promise<any> {
    if (data?.request?.ua) {
      data.uaParsed = userAgentParser(data?.request?.ua);
    }
    return data;
  }

  // 1.5s 执行一次批量插入
  public throttleEsBulk = lodash.throttle(this.esBulk, 1500);

  async esBulk() {
    const len = this.esBatchInsertedData.length;
    if (len <= 0) return;

    const now = Date.now();
    const { body: bulkResponse } = await this.elasticsearchService.bulk({
      refresh: true,
      body: this.esBatchInsertedData,
    });
    this.logger.debug(
      `esBulk 插入${len / 2}条耗时: ${(Date.now() - now) / 1000}s`,
    );

    this.esBatchInsertedData = [];
    this.esBatchInsertedLastTime = Date.now();

    if (bulkResponse?.errors && bulkResponse?.errors.length > 0) {
      this.logger.error(bulkResponse?.errors);
    }
  }

  async batchSaveDocs(index: string, doc: any) {
    this.esBatchInsertedData.push({ index: { _index: index } });
    this.esBatchInsertedData.push(doc);
    await this.throttleEsBulk();
  }
}

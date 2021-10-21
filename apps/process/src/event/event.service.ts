import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SearchService } from 'libs/datasource/elasticsearch/elasticsearch.service';
import { AlertErrorQueueName, AlertQueueName } from 'libs/shared/constant';
import { sha256 } from 'libs/shared';
import { userAgentParser } from 'libs/shared/uaParser';

@Injectable()
export class EventService {
  constructor(
    private readonly searchService: SearchService,
    @InjectQueue(AlertQueueName) private readonly alertQueue: Queue,
  ) {}

  // 发送给告警队列
  async sendAlertQueue(data: any): Promise<void> {
    await this.alertQueue.add(AlertErrorQueueName, data, {
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
}

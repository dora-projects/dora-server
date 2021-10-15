import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SearchService } from 'libs/datasource/elasticsearch/elasticsearch.service';
import { AlertErrorQueueName, AlertQueueName } from 'libs/shared/constant';

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

  // 聚合
  async aggregationError(data): Promise<any> {
    // 增加 ua parser
    return data;
  }

  // ua parser
  async userAgentParser(data): Promise<any> {
    return data;
  }
}

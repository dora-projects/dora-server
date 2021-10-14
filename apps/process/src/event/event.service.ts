import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';
import { SearchService } from 'libs/datasource/elasticsearch/elasticsearch.service';

@Injectable()
export class EventService {
  constructor(private readonly searchService: SearchService) {}

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

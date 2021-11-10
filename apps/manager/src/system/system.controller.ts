import { Controller, Get, Ip, Logger, Post, Req } from '@nestjs/common';
import { SystemService } from './system.service';
import { timeFormNow } from 'libs/shared';
import { ElasticsearchService } from '@nestjs/elasticsearch';

const uptime = new Date().toISOString();

@Controller()
export class SystemController {
  private readonly logger = new Logger(SystemController.name);

  constructor(
    private readonly reportService: SystemService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @Get()
  async test(): Promise<any> {
    return {
      app: 'manager',
      uptime,
      formNow: timeFormNow(uptime),
    };
  }

  @Get('manager/system/elastic/stats')
  async getElasticStats(): Promise<any> {
    const res = await this.elasticsearchService.indices.stats({
      index: 'dora*',
    });
    const indices = res.body?.indices || {};

    const IndexNames = Object.keys(indices) || [];
    return IndexNames.map((name) => {
      return {
        name: name,
        count: indices[name].total.docs,
        store: indices[name].total.store,
      };
    });
  }

  @Get('manager/system/bull/counts')
  async getCounts(): Promise<any> {
    return await this.reportService.getJobCounts();
  }
}

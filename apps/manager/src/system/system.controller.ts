import {
  Controller,
  Get,
  Ip,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SystemService } from './system.service';
import { timeFormNow } from 'libs/shared';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const uptime = new Date().toISOString();

@ApiTags('system')
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('manager/system/bull/counts')
  async getCounts(): Promise<any> {
    return await this.reportService.getJobCounts();
  }
}

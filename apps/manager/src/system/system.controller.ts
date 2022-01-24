import {
  Controller,
  Get,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SystemService } from './system.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('system')
@Controller()
export class SystemController implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SystemController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly systemService: SystemService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit(): Promise<void> {
    return;
  }

  async onModuleDestroy(): Promise<void> {
    return;
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
    return this.systemService.getJobCounts();
  }
}

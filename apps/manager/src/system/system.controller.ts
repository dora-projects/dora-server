import {
  Controller,
  Get,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { Kafka, Admin } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { SystemService } from './system.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('system')
@Controller()
export class SystemController implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SystemController.name);
  private kafkaAdmin: Admin;

  constructor(
    private readonly configService: ConfigService,
    private readonly reportService: SystemService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'dora-manager',
      brokers: this.configService.get('kafka.brokers'),
    });

    this.kafkaAdmin = kafka.admin();
    await this.kafkaAdmin.connect();
  }

  async onModuleDestroy() {
    await this.kafkaAdmin.disconnect();
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
    const topics = await this.kafkaAdmin.listTopics();
    const stat: any = {};
    if (Array.isArray(topics)) {
      const dora_topics = topics.filter((t) => t.startsWith('dora'));
      for await (const topic of dora_topics) {
        stat[topic] = await this.kafkaAdmin.fetchTopicOffsets(topic);
      }
    }
    return stat;
  }
}

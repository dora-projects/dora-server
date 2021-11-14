import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticIndexOfError, ElasticIndexOfPref } from 'libs/shared/constant';

@Injectable()
export class AppBootService implements OnApplicationBootstrap {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  private readonly logger = new Logger(AppBootService.name);

  async onApplicationBootstrap() {
    const exist = await this.checkExist();
    if (!exist) {
      this.logger.log('初始化创建 esIndex 设置 mapping...');
      await this.createEsIndex();
    }
  }

  async checkExist(): Promise<boolean> {
    try {
      const res = await this.elasticsearchService.indices.exists({
        index: [ElasticIndexOfPref, ElasticIndexOfError],
      });
      return res.body;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  async createEsIndex(): Promise<void> {
    const resPref = await this.elasticsearchService.indices.create({
      index: ElasticIndexOfPref,
      body: {
        mappings: {
          properties: {
            timestamp: {
              type: 'date',
            },
          },
        },
      },
    });

    const resError = await this.elasticsearchService.indices.create({
      index: ElasticIndexOfError,
      body: {
        mappings: {
          properties: {
            timestamp: {
              type: 'date',
            },
          },
        },
      },
    });
  }
}

@Injectable()
export class AppShutdownService implements OnApplicationShutdown {
  private readonly logger = new Logger(AppShutdownService.name);

  onApplicationShutdown(signal: string) {
    console.log();
    this.logger.log(`Received signal:${signal}`);
    this.logger.log('App exit！');
  }
}

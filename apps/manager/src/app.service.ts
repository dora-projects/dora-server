import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticIndexOfError, ElasticIndexOfPerf } from 'libs/shared/constant';
import { PrismaService } from 'libs/datasource';

@Injectable()
export class AppService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly logger = new Logger(AppService.name);

  async onApplicationBootstrap() {
    const exist = await this.checkExist();
    if (!exist) {
      this.logger.log('初始化创建 esIndex 设置 mapping...');
      await this.createEsIndex();
    }

    // todo 初始化检查 数据库
  }

  async checkExist(): Promise<boolean> {
    try {
      const res = await this.elasticsearchService.indices.exists({
        index: [ElasticIndexOfPerf, ElasticIndexOfError],
      });
      return res.body;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  async createEsIndex(): Promise<void> {
    await this.elasticsearchService.indices.create({
      index: ElasticIndexOfPerf,
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

    await this.elasticsearchService.indices.create({
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

  onApplicationShutdown(signal?: string): any {
    console.log();
    this.logger.log(`Received signal:${signal}`);
    this.logger.log('App exit！');
  }
}

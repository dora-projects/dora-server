import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async ping(): Promise<boolean> {
    const result = await this.elasticsearchService.ping({ human: true });
    return result.body;
  }

  async checkIndexIsExist(): Promise<boolean> {
    try {
      await this.elasticsearchService.search({ index: 'dora' });
      return true;
    } catch (e) {
      return false;
    }
  }

  async createIndex(): Promise<boolean> {
    return true;
  }

  async saveData(data: any): Promise<any> {
    const result = await this.elasticsearchService.index({
      index: 'dora',
      body: data,
    });
    return result;
  }
}

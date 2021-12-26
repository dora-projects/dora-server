import { Controller, Logger } from '@nestjs/common';
import * as lodash from 'lodash';
import { sha256 } from 'libs/shared';
import { userAgentParser } from 'libs/shared/uaParser';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  // 记录上次插入的时间
  private esBatchInsertedLastTime: number = Date.now();
  private esBatchInsertedData: any[] = [];

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  // todo 聚合
  async aggregationError(data): Promise<any> {
    if (data?.error) {
      const errorMessage = lodash.get(data, 'error.values[0].value');
      data.fingerprint = sha256(`${errorMessage}`);
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

  // 1.5s 执行一次批量插入
  public throttleEsBulk = lodash.throttle(this.esBulk, 1500);

  async esBulk() {
    const len = this.esBatchInsertedData.length;
    if (len <= 0) return;

    const now = Date.now();
    const { body: bulkResponse } = await this.elasticsearchService.bulk({
      refresh: true,
      body: this.esBatchInsertedData,
    });
    this.logger.debug(
      `esBulk 插入${len / 2}条耗时: ${(Date.now() - now) / 1000}s`,
    );

    this.esBatchInsertedData = [];
    this.esBatchInsertedLastTime = Date.now();

    if (bulkResponse?.errors && bulkResponse?.errors.length > 0) {
      this.logger.error(bulkResponse?.errors);
    }
  }

  async batchSaveDocs(index: string, doc: any) {
    this.esBatchInsertedData.push({ index: { _index: index } });
    this.esBatchInsertedData.push(doc);
    await this.throttleEsBulk();
  }
}

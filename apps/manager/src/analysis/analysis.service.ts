import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProjectService } from '../project/project.service';
import { BadRequestException, UnauthorizedOperation } from '../common/error';
import { CommonParams, RangeParams, TrendRangeParams } from './analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  getHello(): string {
    return 'Hello !';
  }

  matchAppKeyInString(input: string): string {
    const result = input.match(/"appKey":"(\w+)"/);
    if (result && result.length >= 2) {
      return result[1];
    }
    return null;
  }

  async doQuery(eql: any, userId: number): Promise<any> {
    if (!eql) return;
    const eqlString = JSON.stringify(eql);
    const appKey = this.matchAppKeyInString(eqlString);
    if (!appKey) {
      throw new BadRequestException('查询语句未找到 appKey');
    }

    const canAccess = await this.projectService.isUserCanAccessProject(
      appKey,
      userId,
    );
    if (!canAccess) throw new UnauthorizedOperation('无权限访问该项目');

    const result = await this.elasticsearchService.search({
      index: 'dora*',
      body: eql,
    });

    return result;
  }

  commonQueryFilter(params: CommonParams & RangeParams) {
    const filter: any[] = [];
    if (params.appKey) filter.push({ match: { appKey: params.appKey } });
    if (params.type) filter.push({ match: { type: params.type } });
    if (params.release) filter.push({ match: { release: params.release } });
    if (params.environment) {
      filter.push({ match: { environment: params.environment } });
    }
    if (params.from && params?.to) {
      filter.push({
        range: { timestamp: { gte: params.from, lte: params.to } },
      });
    }
    return filter;
  }

  async eventTypeCount(params: CommonParams & RangeParams) {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        query: { bool: { filter } },
        aggregations: {
          count: {
            cardinality: {
              field: 'event_id.keyword',
            },
          },
        },
      },
    });
    return res.body?.aggregations?.count?.value;
  }

  async eventTypeTrend(params: CommonParams & TrendRangeParams) {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        query: { bool: { filter } },
        aggregations: {
          trend: {
            date_histogram: {
              field: 'timestamp',
              fixed_interval: params.interval,
              time_zone: '+08:00',
              format: 'yyyy-MM-dd HH:mm:ss',
            },
            aggregations: {
              count: {
                cardinality: {
                  field: 'event_id.keyword',
                },
              },
            },
          },
        },
      },
    });
    return res.body?.aggregations?.trend?.buckets;
  }

  /**
   * 第一次内容绘制
   * Good < 1000ms
   * Me  > 1000ms
   * Bad > 3000ms
   */
  async getFirstContentfulPaintRange(params: CommonParams & RangeParams) {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: 0,
        query: { bool: { filter } },
        aggregations: {
          fcp: {
            range: {
              field: 'measurements.fcp',
              ranges: [{ to: 1000 }, { from: 1000, to: 2000 }, { from: 3000 }],
            },
          },
        },
      },
    });
    return res.body?.aggregations?.fcp?.buckets;
  }

  /**
   * 最大的内容绘制
   * Good < 2500ms
   * Me  > 2500ms
   * Bad > 4000ms
   */
  async getLargestContentfulPaintRange(params: CommonParams & RangeParams) {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: 0,
        query: { bool: { filter } },
        aggregations: {
          lcp: {
            range: {
              field: 'measurements.lcp',
              ranges: [{ to: 2500 }, { from: 2500, to: 4000 }, { from: 4000 }],
            },
          },
        },
      },
    });
    return res.body?.aggregations?.lcp?.buckets;
  }

  /**
   * 首次输入延迟
   * Good < 100ms
   * Me  > 100ms
   * Bad > 300ms
   */
  async getFirstInputDelayRange(params: CommonParams & RangeParams) {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: 0,
        query: { bool: { filter } },
        aggregations: {
          fid: {
            range: {
              field: 'measurements.fid',
              ranges: [{ to: 100 }, { from: 100, to: 300 }, { from: 300 }],
            },
          },
        },
      },
    });
    return res.body?.aggregations?.fid?.buckets;
  }

  /**
   * 累积布局偏移
   * Good < 0.1
   * Me  > 0.1
   * Bad > 0.25
   */
  async getCumulativeLayoutShiftRange(params: CommonParams & RangeParams) {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: 0,
        query: { bool: { filter } },
        aggregations: {
          cls: {
            range: {
              field: 'measurements.cls',
              ranges: [{ to: 0.1 }, { from: 0.1, to: 0.25 }, { from: 0.25 }],
            },
          },
        },
      },
    });
    return res.body?.aggregations?.cls?.buckets;
  }
}

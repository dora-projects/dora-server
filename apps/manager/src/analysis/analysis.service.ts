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

  async getWebVitalsRange(params: CommonParams & RangeParams): Promise<any> {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: 0,
        query: { bool: { filter } },
        aggregations: {
          fp: {
            range: {
              field: 'measurements.fp',
              ranges: [
                { key: 'good', to: 1000 },
                { key: 'me', from: 1000, to: 2000 },
                { key: 'bad', from: 3000 },
              ],
            },
          },
          fcp: {
            range: {
              field: 'measurements.fcp',
              ranges: [
                { key: 'good', to: 1000 },
                { key: 'me', from: 1000, to: 2000 },
                { key: 'bad', from: 3000 },
              ],
            },
          },
          lcp: {
            range: {
              field: 'measurements.lcp',
              ranges: [
                { key: 'good', to: 2500 },
                { key: 'me', from: 2500, to: 4000 },
                { key: 'bad', from: 4000 },
              ],
            },
          },
          fid: {
            range: {
              field: 'measurements.fid',
              ranges: [
                { key: 'good', to: 100 },
                { key: 'me', from: 100, to: 300 },
                { key: 'bad', from: 300 },
              ],
            },
          },
          cls: {
            range: {
              field: 'measurements.cls',
              ranges: [
                { key: 'good', to: 0.1 },
                { key: 'me', from: 0.1, to: 0.25 },
                { key: 'bad', from: 0.25 },
              ],
            },
          },
        },
      },
    });
    return res.body?.aggregations;
  }

  async getWebVitalsPercentiles(
    params: CommonParams & RangeParams,
  ): Promise<any> {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: 0,
        query: { bool: { filter } },
        aggregations: {
          fp: {
            percentiles: { field: 'measurements.fp' },
          },
          fcp: {
            percentiles: { field: 'measurements.fcp' },
          },
          lcp: {
            percentiles: { field: 'measurements.lcp' },
          },
          fid: {
            percentiles: { field: 'measurements.fid' },
          },
          cls: {
            percentiles: { field: 'measurements.cls' },
          },
        },
      },
    });
    return res.body?.aggregations;
  }

  async getWebVitalsHistogram(
    params: CommonParams & RangeParams,
  ): Promise<any> {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: 0,
        query: { bool: { filter } },
        aggregations: {
          fp: {
            histogram: { field: 'measurements.fp', interval: 50 },
          },
          fcp: {
            histogram: { field: 'measurements.fcp', interval: 50 },
          },
          lcp: {
            histogram: { field: 'measurements.lcp', interval: 50 },
          },
          fid: {
            histogram: { field: 'measurements.fid', interval: 0.5 },
          },
          cls: {
            histogram: { field: 'measurements.cls', interval: 0.01 },
          },
        },
      },
    });
    return res.body?.aggregations;
  }
}

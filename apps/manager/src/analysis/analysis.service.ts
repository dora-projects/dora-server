import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProjectService } from '../project/project.service';
import { CommonParams, RangeParams, TrendRangeParams } from './analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  // matchAppKeyInString(input: string): string {
  //   const result = input.match(/"appKey":"(\w+)"/);
  //   if (result && result.length >= 2) {
  //     return result[1];
  //   }
  //   return null;
  // }

  // async doQuery(eql: any, userId: number): Promise<any> {
  //   if (!eql) return;
  //   const eqlString = JSON.stringify(eql);
  //   const appKey = this.matchAppKeyInString(eqlString);
  //   if (!appKey) {
  //     throw new BadRequestException('查询语句未找到 appKey');
  //   }
  //
  //   const canAccess = await this.projectService.isUserCanAccessProject(
  //     appKey,
  //     userId,
  //   );
  //   if (!canAccess) throw new UnauthorizedOperation('无权限访问该项目');
  //
  //   const result = await this.elasticsearchService.search({
  //     index: 'dora*',
  //     body: eql,
  //   });
  //
  //   return result;
  // }

  commonQueryFilter(params: CommonParams & RangeParams) {
    const filter: any[] = [];
    if (params.appKey) filter.push({ match: { appKey: params.appKey } });
    if (params.type) filter.push({ match: { type: params.type } });
    if (params.release) filter.push({ match: { release: params.release } });
    if (params.environment) {
      filter.push({ match: { environment: params.environment } });
    }
    if (params.fingerprint) {
      filter.push({ match: { fingerprint: params.fingerprint } });
    }
    if (params.from && params?.to) {
      filter.push({
        range: { timestamp: { gte: params.from, lte: params.to } },
      });
    }
    return filter;
  }

  async getLogs(params: CommonParams & RangeParams): Promise<any> {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: params?.size || 100,
        query: { bool: { filter } },
      },
    });
    return res.body?.hits;
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
    return res.body?.aggregations?.count;
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
              field: 'perf.fp',
              ranges: [
                { key: 'good', to: 1000 },
                { key: 'meh', from: 1000, to: 3000 },
                { key: 'bad', from: 3000 },
              ],
            },
          },
          fcp: {
            range: {
              field: 'perf.fcp',
              ranges: [
                { key: 'good', to: 1000 },
                { key: 'meh', from: 1000, to: 3000 },
                { key: 'bad', from: 3000 },
              ],
            },
          },
          lcp: {
            range: {
              field: 'perf.lcp',
              ranges: [
                { key: 'good', to: 2500 },
                { key: 'meh', from: 2500, to: 4000 },
                { key: 'bad', from: 4000 },
              ],
            },
          },
          fid: {
            range: {
              field: 'perf.fid',
              ranges: [
                { key: 'good', to: 100 },
                { key: 'meh', from: 100, to: 300 },
                { key: 'bad', from: 300 },
              ],
            },
          },
          cls: {
            range: {
              field: 'perf.cls',
              ranges: [
                { key: 'good', to: 0.1 },
                { key: 'meh', from: 0.1, to: 0.25 },
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
            percentiles: { field: 'perf.fp' },
          },
          fcp: {
            percentiles: { field: 'perf.fcp' },
          },
          lcp: {
            percentiles: { field: 'perf.lcp' },
          },
          fid: {
            percentiles: { field: 'perf.fid' },
          },
          cls: {
            percentiles: { field: 'perf.cls' },
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
            histogram: {
              field: 'perf.fp',
              interval: 50,
              extended_bounds: {
                min: 0,
                max: 3500,
              },
            },
          },
          fcp: {
            histogram: {
              field: 'perf.fcp',
              interval: 50,
              extended_bounds: {
                min: 0,
                max: 3500,
              },
            },
          },
          lcp: {
            histogram: {
              field: 'perf.lcp',
              interval: 50,
              extended_bounds: {
                min: 0,
                max: 3500,
              },
            },
          },
          fid: {
            histogram: {
              field: 'perf.fid',
              interval: 10,
              extended_bounds: {
                min: 0,
                max: 1000,
              },
            },
          },
          cls: {
            histogram: {
              field: 'perf.cls',
              interval: 0.02,
              extended_bounds: {
                min: 0,
                max: 1,
              },
            },
          },
        },
      },
    });
    return res.body?.aggregations;
  }

  async getFiledCountList(
    field: string,
    params: CommonParams & RangeParams,
  ): Promise<any> {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: 0,
        query: { bool: { filter } },
        aggregations: {
          [field]: {
            terms: {
              field: `${field}.keyword`,
              size: params?.size || 10,
              order: {
                count: 'desc',
              },
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
    return res.body?.aggregations?.[field]?.buckets;
  }

  async getFiledOptions(field: string, appKey: string) {
    const filter = this.commonQueryFilter({ appKey });
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: 0,
        query: { bool: { filter } },
        aggregations: {
          [field]: {
            terms: {
              field: `${field}.keyword`,
              size: 10,
            },
          },
        },
      },
    });
    return res.body?.aggregations?.[field]?.buckets;
  }

  async getReleaseList(params: CommonParams & RangeParams) {
    const filter = this.commonQueryFilter(params);
    const res = await this.elasticsearchService.search({
      index: 'dora*',
      body: {
        size: 0,
        query: { bool: { filter } },
        aggregations: {
          release: {
            terms: {
              field: `release.keyword`,
              size: params?.size || 10,
              order: { earliest: 'desc' },
            },
            aggregations: {
              latest: { max: { field: 'timestamp' } },
              earliest: { min: { field: 'timestamp' } },
              // latest: {
              //   top_hits: {
              //     sort: [
              //       {
              //         timestamp: {
              //           order: 'desc',
              //         },
              //       },
              //     ],
              //     _source: {
              //       includes: ['timestamp', 'type'],
              //     },
              //     size: 1,
              //   },
              // },
              // earliest: {
              //   top_hits: {
              //     sort: [
              //       {
              //         timestamp: {
              //           order: 'asc',
              //         },
              //       },
              //     ],
              //     _source: {
              //       includes: ['timestamp', 'type'],
              //     },
              //     size: 1,
              //   },
              // },
              countError: {
                filter: { term: { type: 'error' } },
                aggs: {
                  count: {
                    cardinality: {
                      field: 'event_id.keyword',
                    },
                  },
                },
              },
              countEvent: {
                cardinality: {
                  field: 'event_id.keyword',
                },
              },
              fp: {
                percentiles: { field: 'perf.fp', percents: [75] },
              },
              fcp: {
                percentiles: { field: 'perf.fcp', percents: [75] },
              },
              lcp: {
                percentiles: { field: 'perf.lcp', percents: [75] },
              },
              fid: {
                percentiles: { field: 'perf.fid', percents: [75] },
              },
              cls: {
                percentiles: { field: 'perf.cls', percents: [75] },
              },
            },
          },
        },
      },
    });
    return res.body?.aggregations?.release?.buckets;
  }
}

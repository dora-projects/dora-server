import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProjectService } from '../project/project.service';
import { BadRequestException, UnauthorizedOperation } from '../common/error';

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
}

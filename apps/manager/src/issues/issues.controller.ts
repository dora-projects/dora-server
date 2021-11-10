import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Issue } from 'libs/datasource';

@ApiTags('issues')
@Controller()
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get('manager/issues')
  getIssues(
    @Query('appKey') appKey,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
  ): Promise<Pagination<Issue>> {
    limit = limit > 100 ? 100 : limit;
    return this.issuesService.list(appKey, { page, limit });
  }
}

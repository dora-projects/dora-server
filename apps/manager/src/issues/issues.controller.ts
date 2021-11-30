import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Issue } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('issues')
@Controller()
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get('manager/issues')
  getIssues(
    @Query('appKey') appKey,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('release') release,
    @Query('environment') environment,
    @Query('from') from,
    @Query('to') to,
  ): Promise<Issue[]> {
    limit = limit > 100 ? 100 : limit;
    return this.issuesService.list({
      appKey,
      release,
      environment,
      from,
      to,
      page,
      limit,
    });
  }
}

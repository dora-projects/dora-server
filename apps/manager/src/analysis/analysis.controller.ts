import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CommonParams, RangeParams, TrendRangeParams } from './analysis.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('analysis')
@Controller()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('manager/analysis/logs')
  async queryLogs(@Query() query: CommonParams & RangeParams): Promise<any> {
    return await this.analysisService.getLogs(query);
  }

  @Get('manager/analysis/event/count')
  async queryCount(@Query() query: CommonParams & RangeParams): Promise<any> {
    return await this.analysisService.eventTypeCount(query);
  }

  @Get('manager/analysis/event/trend')
  async queryTrend(
    @Query() query: CommonParams & TrendRangeParams,
  ): Promise<any> {
    return await this.analysisService.eventTypeTrend(query);
  }

  @Get('manager/analysis/web_vitals/range')
  async queryWebVitalsRange(
    @Query() query: CommonParams & RangeParams,
  ): Promise<any> {
    return await this.analysisService.getWebVitalsRange(query);
  }

  @Get('manager/analysis/web_vitals/percentiles')
  async queryWebVitalsPercentiles(
    @Query() query: CommonParams & RangeParams,
  ): Promise<any> {
    return await this.analysisService.getWebVitalsPercentiles(query);
  }

  @Get('manager/analysis/web_vitals/histogram')
  async queryWebVitalsHistogram(
    @Query() query: CommonParams & RangeParams,
  ): Promise<any> {
    return await this.analysisService.getWebVitalsHistogram(query);
  }

  @Get('manager/analysis/filed/count/list')
  async queryFiledCountList(
    @Query('field') field: string,
    @Query() query: CommonParams & RangeParams,
  ): Promise<any> {
    return await this.analysisService.getFiledCountList(field, query);
  }

  @Get('manager/analysis/filed/options')
  async queryFiledOptions(
    @Query('field') field: string,
    @Query('appKey') appKey: string,
  ): Promise<any> {
    return await this.analysisService.getFiledOptions(field, appKey);
  }

  @Get('manager/analysis/release/list')
  async queryReleaseList(
    @Query() query: CommonParams & RangeParams,
  ): Promise<any> {
    return await this.analysisService.getReleaseList(query);
  }

  // @Post('manager/analysis/eql')
  // async clientEql(
  //   @Request() req,
  //   @Body() eqlQueryBody: EqlQueryBody,
  // ): Promise<any> {
  //   const userId = req.user?.id;
  //   const { eql } = eqlQueryBody;
  //   const result = await this.analysisService.doQuery(eql, userId);
  //   return result?.body;
  // }
}

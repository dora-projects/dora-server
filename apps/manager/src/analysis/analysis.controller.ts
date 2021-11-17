import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CommonParams, EqlQueryBody, RangeParams } from './analysis.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('analysis')
@Controller()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

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

  @Post('manager/analysis/eql')
  async clientEql(
    @Request() req,
    @Body() eqlQueryBody: EqlQueryBody,
  ): Promise<any> {
    const userId = req.user?.id;
    const { eql } = eqlQueryBody;
    const result = await this.analysisService.doQuery(eql, userId);
    return result?.body;
  }
}

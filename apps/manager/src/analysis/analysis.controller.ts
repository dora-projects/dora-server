import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { EqlQueryBody } from './analysis.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('analysis')
@Controller()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('manager/analysis')
  getHello(): string {
    return this.analysisService.getHello();
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

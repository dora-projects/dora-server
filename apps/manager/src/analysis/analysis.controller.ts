import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';

@ApiTags('analysis')
@Controller()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('api/analysis')
  getHello(): string {
    return this.analysisService.getHello();
  }
}

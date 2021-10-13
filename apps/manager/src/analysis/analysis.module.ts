import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
  imports: [],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}

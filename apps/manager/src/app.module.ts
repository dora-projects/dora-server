import { Module } from '@nestjs/common';

import { AnalysisModule } from './analysis/analysis.module';
import { ConsumeModule } from './consume/consume.module';

@Module({
  imports: [AnalysisModule, ConsumeModule],
})
export class AppModule {}

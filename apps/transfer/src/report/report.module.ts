import { Module } from '@nestjs/common';

import { ReportController } from './core/report.controller';
import { ReportService } from './core/report.service';
import { ReportProcessor } from './core/report.processor';
import { EventBullQueueModule } from 'libs/datasource/bull';
import { MyElasticModule } from 'libs/datasource/elasticsearch';

@Module({
  imports: [EventBullQueueModule, MyElasticModule],
  controllers: [ReportController],
  providers: [ReportProcessor, ReportService],
})
export class ReportModule {}

import { Module } from '@nestjs/common';

import { ReportController } from './core/report.controller';
import { ReportService } from './core/report.service';
import { ReportProcessor } from './core/report.processor';
import { EventBullQueueModule } from 'libs/datasource/bull';
import { MyElasticModule } from 'libs/datasource/elasticsearch';
import { SearchService } from 'libs/datasource/elasticsearch/elasticsearch.service';

@Module({
  imports: [EventBullQueueModule, MyElasticModule],
  controllers: [ReportController],
  providers: [ReportProcessor, ReportService, SearchService],
})
export class ReportModule {}

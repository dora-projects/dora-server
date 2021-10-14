import { Module } from '@nestjs/common';

import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { EventBullQueueModule } from 'libs/datasource/bull';
import { MyElasticModule } from 'libs/datasource/elasticsearch';
import { SearchService } from 'libs/datasource/elasticsearch/elasticsearch.service';

@Module({
  imports: [EventBullQueueModule, MyElasticModule],
  controllers: [SystemController],
  providers: [SystemService, SearchService],
})
export class SystemModule {}

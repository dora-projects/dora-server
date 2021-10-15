import { Module } from '@nestjs/common';

import { EventProcessor } from './event.processor';
import { EventService } from './event.service';
import {
  AlertBullQueueModule,
  EventBullQueueModule,
} from 'libs/datasource/bull';
import { MyElasticModule } from 'libs/datasource/elasticsearch';
import { SearchService } from 'libs/datasource/elasticsearch/elasticsearch.service';

@Module({
  imports: [EventBullQueueModule, AlertBullQueueModule, MyElasticModule],
  providers: [EventProcessor, EventService, SearchService],
})
export class EventModule {}

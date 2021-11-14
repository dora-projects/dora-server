import { Module } from '@nestjs/common';
import {
  AlertBullQueueModule,
  EventBullQueueModule,
  IssueQueueModule,
} from 'libs/datasource/bull';
import { MyElasticModule } from 'libs/datasource/elasticsearch';

import { EventProcessor } from './event.processor';
import { EventService } from './event.service';

@Module({
  imports: [
    EventBullQueueModule,
    AlertBullQueueModule,
    IssueQueueModule,
    MyElasticModule,
  ],
  providers: [EventProcessor, EventService],
})
export class EventModule {}

import { Module } from '@nestjs/common';
import { MyElasticModule } from 'libs/datasource/elasticsearch';
import {
  registerQueueAlert,
  registerQueueEvent,
  registerQueueIssue,
} from 'libs/datasource';

import { EventProcess } from './event.process';
import { EventService } from './event.service';

@Module({
  imports: [
    registerQueueEvent,
    registerQueueIssue,
    registerQueueAlert,
    MyElasticModule,
  ],
  providers: [EventProcess, EventService],
})
export class EventModule {}

import { Module } from '@nestjs/common';

import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { MyElasticModule } from 'libs/datasource/elasticsearch';
import {
  registerQueueAlert,
  registerQueueEvent,
  registerQueueIssue,
} from 'libs/datasource';

@Module({
  imports: [
    registerQueueEvent,
    registerQueueIssue,
    registerQueueAlert,
    MyElasticModule,
  ],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}

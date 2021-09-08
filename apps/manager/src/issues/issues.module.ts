import { Module } from '@nestjs/common';
import { IssuesProcessor } from './issues.processor';
import { EventBullQueueModule } from 'libs/datasource';

@Module({
  imports: [EventBullQueueModule],
  providers: [IssuesProcessor],
})
export class IssuesModule {}

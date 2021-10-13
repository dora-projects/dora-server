import { Module } from '@nestjs/common';
import { IssuesProcessor } from './issues.processor';
import { EventBullQueueModule } from 'libs/datasource';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';

@Module({
  imports: [EventBullQueueModule],
  controllers: [IssuesController],
  providers: [IssuesProcessor, IssuesService],
})
export class IssuesModule {}

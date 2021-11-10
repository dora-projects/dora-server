import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}

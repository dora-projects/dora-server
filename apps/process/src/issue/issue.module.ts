import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueService } from './issue.service';
import { IssueProcessor } from './issue.processor';
import {
  MyDatabase,
  MyElasticModule,
  IssueQueueModule,
  Project,
  Issue,
} from 'libs/datasource';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Issue]),
    IssueQueueModule,
    MyElasticModule,
    MyDatabase,
  ],
  providers: [IssueService, IssueProcessor],
})
export class IssueModule {}

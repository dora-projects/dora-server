import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueProcess } from './issue.process';
import { MyElasticModule, registerQueueIssue } from 'libs/datasource';
import { PrismaService } from 'libs/datasource/prisma.service';

@Module({
  imports: [registerQueueIssue, MyElasticModule],
  providers: [IssueProcess, IssueService, PrismaService],
})
export class IssueModule {}

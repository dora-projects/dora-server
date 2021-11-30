import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueProcessor } from './issue.processor';
import { MyElasticModule, IssueQueueModule } from 'libs/datasource';
import { PrismaService } from 'libs/datasource/prisma.service';

@Module({
  imports: [IssueQueueModule, MyElasticModule],
  providers: [IssueService, IssueProcessor, PrismaService],
})
export class IssueModule {}

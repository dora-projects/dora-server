import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { MyElasticModule } from 'libs/datasource';
import { PrismaService } from 'libs/datasource/prisma.service';
import { KafkaModule } from 'libs/datasource/kafka';

@Module({
  imports: [KafkaModule, MyElasticModule],
  controllers: [IssueController],
  providers: [IssueService, PrismaService],
})
export class IssueModule {}

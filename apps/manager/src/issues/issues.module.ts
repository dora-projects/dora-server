import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { PrismaService } from 'libs/datasource/prisma.service';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService, PrismaService],
})
export class IssuesModule {}

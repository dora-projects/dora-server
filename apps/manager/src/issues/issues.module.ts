import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from 'libs/datasource';

@Module({
  imports: [TypeOrmModule.forFeature([Issue])],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}

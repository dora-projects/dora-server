import { Module } from '@nestjs/common';

import { MyConfigModule } from 'libs/shared/config';
import { MyBullModule, MyElasticModule } from 'libs/datasource';

import { AnalysisModule } from './analysis/analysis.module';
import { IssuesModule } from './issues/issues.module';

@Module({
  imports: [
    MyBullModule,
    MyElasticModule,
    MyConfigModule,
    AnalysisModule,
    IssuesModule,
  ],
})
export class AppModule {}

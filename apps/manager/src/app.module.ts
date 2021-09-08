import { Module } from '@nestjs/common';

import { MyConfigModule } from 'libs/shared/config';
import { MyBullModule, MyDatabase, MyElasticModule } from 'libs/datasource';

import { AnalysisModule } from './analysis/analysis.module';
import { IssuesModule } from './issues/issues.module';

@Module({
  imports: [
    MyBullModule,
    MyElasticModule,
    MyConfigModule,
    MyDatabase,
    AnalysisModule,
    IssuesModule,
  ],
})
export class AppModule {}

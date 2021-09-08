import { Module } from '@nestjs/common';

import { ReportModule } from './report/report.module';
import { MyConfigModule } from 'libs/shared/config';
import { MyBullModule } from 'libs/datasource';

@Module({
  imports: [MyBullModule, MyConfigModule, ReportModule],
})
export class AppModule {}

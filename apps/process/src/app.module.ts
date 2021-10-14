import { Module } from '@nestjs/common';

import { MyConfigModule } from 'libs/datasource/config';
import { MyBullModule, MyDatabase, MyElasticModule } from 'libs/datasource';

import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    MyBullModule,
    MyElasticModule,
    MyConfigModule,
    MyDatabase,
    AlertModule,
  ],
})
export class AppModule {}

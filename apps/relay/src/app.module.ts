import { Module } from '@nestjs/common';

import { ReceiverModule } from './receiver/receiver.module';
import { MyConfigModule } from 'libs/datasource/config';
import { MyBullModule } from 'libs/datasource';

@Module({
  imports: [MyBullModule, MyConfigModule, ReceiverModule],
})
export class AppModule {}

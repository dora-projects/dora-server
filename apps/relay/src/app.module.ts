import { Module } from '@nestjs/common';

import { ReceiverModule } from './receiver/receiver.module';
import { MyConfigModule } from 'libs/datasource/config';

import { AppController } from './app.controller';
import { QueueModule } from 'libs/datasource';

@Module({
  imports: [MyConfigModule, QueueModule, ReceiverModule],
  controllers: [AppController],
})
export class AppModule {}

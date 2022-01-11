import { Module } from '@nestjs/common';

import { ReceiverModule } from './receiver/receiver.module';
import { MyConfigModule } from 'libs/datasource/config';

import { AppController } from './app.controller';

@Module({
  imports: [MyConfigModule, ReceiverModule],
  controllers: [AppController],
})
export class AppModule {}

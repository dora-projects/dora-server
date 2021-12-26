import { Module } from '@nestjs/common';

import { ReceiverModule } from './receiver/receiver.module';
import { MyConfigModule } from 'libs/datasource/config';

@Module({
  imports: [MyConfigModule, ReceiverModule],
})
export class AppModule {}

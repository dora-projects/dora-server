import { Module } from '@nestjs/common';

import { registerQueueEvent } from 'libs/datasource';

import { ReceiverController } from './receiver.controller';
import { ReceiverService } from './receiver.service';
import { SentryService } from './sentry.service';

@Module({
  imports: [registerQueueEvent],
  controllers: [ReceiverController],
  providers: [ReceiverService, SentryService],
})
export class ReceiverModule {}

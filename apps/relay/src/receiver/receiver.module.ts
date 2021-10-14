import { Module } from '@nestjs/common';

import { ReceiverController } from './receiver.controller';
import { ReceiverService } from './receiver.service';
import { SentryService } from './sentry.service';
import { EventBullQueueModule } from 'libs/datasource/bull';

@Module({
  imports: [EventBullQueueModule],
  controllers: [ReceiverController],
  providers: [ReceiverService, SentryService],
})
export class ReceiverModule {}

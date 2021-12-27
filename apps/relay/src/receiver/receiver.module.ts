import { Module } from '@nestjs/common';

import { ReceiverController } from './receiver.controller';
import { ReceiverService } from './receiver.service';
import { SentryService } from './sentry.service';

@Module({
  controllers: [ReceiverController],
  providers: [ReceiverService, SentryService],
})
export class ReceiverModule {}

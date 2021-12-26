import { Module } from '@nestjs/common';
import { KafkaModule } from 'libs/datasource/kafka';

import { ReceiverController } from './receiver.controller';
import { ReceiverService } from './receiver.service';
import { SentryService } from './sentry.service';

@Module({
  imports: [KafkaModule],
  controllers: [ReceiverController],
  providers: [ReceiverService, SentryService],
})
export class ReceiverModule {}

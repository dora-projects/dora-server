import { Module } from '@nestjs/common';

import { ReceiverController } from './receiver.controller';
import { ReceiverService } from './receiver.service';
import { ReceiverProcessor } from './receiver.processor';
import { EventBullQueueModule } from 'libs/datasource/bull';
import { MyElasticModule } from 'libs/datasource/elasticsearch';
import { SearchService } from 'libs/datasource/elasticsearch/elasticsearch.service';

@Module({
  imports: [EventBullQueueModule, MyElasticModule],
  controllers: [ReceiverController],
  providers: [ReceiverProcessor, ReceiverService, SearchService],
})
export class ReceiverModule {}

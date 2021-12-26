import { Module } from '@nestjs/common';
import { MyElasticModule } from 'libs/datasource/elasticsearch';
import { KafkaModule } from 'libs/datasource/kafka';

import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [KafkaModule, MyElasticModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}

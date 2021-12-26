import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';

import { Message_Error, Message_Perf } from 'libs/shared/constant';
import { KAFKA_SERVICE } from 'libs/datasource/kafka';
import { perfValidate, errorValidate } from './schema';
import { EventLike } from './receiver.dto';

@Injectable()
export class ReceiverService implements OnModuleInit {
  private readonly logger = new Logger(ReceiverService.name);
  private kafkaProducer: Producer;

  constructor(
    @Inject(KAFKA_SERVICE)
    private clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaProducer = await this.clientKafka.connect();
  }

  async formatData(data, ip) {
    try {
      const bodyData = typeof data === 'string' ? JSON.parse(data) : data;
      const { context, values } = bodyData;

      if (!context || !Array.isArray(values)) {
        return;
      }

      return bodyData.values.map((value) => {
        const eventContent = value.content;
        const event_id = value.event_id;
        const timestamp = value.timestamp;
        const request = value.request;

        return {
          ...context,
          ...eventContent,
          ip,
          event_id,
          timestamp,
          request,
        };
      });
    } catch (e) {
      this.logger.debug(e, e?.stack);
      return null;
    }
  }

  async verifyAndPushEvent(events: EventLike[]): Promise<any> {
    let errors: any = [];

    for await (const event of events) {
      switch (event?.type) {
        case 'perf':
          if (perfValidate(event)) {
            await this.pushPerfEventToQueue(event);
          } else {
            errors = errors.concat(perfValidate.errors);
          }
          break;
        case 'error':
          if (errorValidate(event)) {
            await this.pushErrorEventToQueue(event);
          } else {
            errors = errors.concat(errorValidate.errors);
          }
          break;
        case 'api':
          break;
        case 'res':
          break;
        case 'visit':
          break;
        default:
      }
    }

    return errors;
  }

  // error
  async pushErrorEventToQueue(data: EventLike): Promise<any> {
    try {
      await this.kafkaProducer.send({
        topic: Message_Error,
        messages: [{ key: Message_Error, value: JSON.stringify(data) }],
      });
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }

  // perf
  async pushPerfEventToQueue(data: EventLike): Promise<any> {
    try {
      await this.kafkaProducer.send({
        topic: Message_Perf,
        messages: [{ key: Message_Perf, value: JSON.stringify(data) }],
      });
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }
}

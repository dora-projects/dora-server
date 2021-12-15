import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  ErrorEventQueueName,
  EventQueue,
  PerfEventQueueName,
} from 'libs/shared/constant';
import { EventLike } from './receiver.dto';
import { perfValidate, errorValidate } from './schema';

@Injectable()
export class ReceiverService {
  private readonly logger = new Logger(ReceiverService.name);

  constructor(@InjectQueue(EventQueue) private readonly eventQueue: Queue) {}

  async formatData(data, ip) {
    try {
      const bodyData = JSON.parse(data);
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
      await this.eventQueue.add(ErrorEventQueueName, data, {
        removeOnComplete: true,
      });
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }

  // perf
  async pushPerfEventToQueue(data: EventLike): Promise<any> {
    try {
      await this.eventQueue.add(PerfEventQueueName, data, {
        removeOnComplete: true,
      });
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }
}

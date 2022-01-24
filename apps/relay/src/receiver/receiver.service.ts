import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EventLike } from './receiver.dto';
import { errorValidate, perfValidate } from './schema';
import { Queue_Event, Event_Error, Event_Perf } from 'libs/shared/constant';

@Injectable()
export class ReceiverService {
  private readonly logger = new Logger(ReceiverService.name);

  constructor(@InjectQueue(Queue_Event) private queue: Queue) {}

  async pushPerfEvent(data: EventLike): Promise<void> {
    this.logger.debug(Event_Perf);
    await this.queue.add(Event_Perf, data);
  }

  async pushErrorEvent(data: EventLike): Promise<void> {
    this.logger.debug(Event_Error);
    await this.queue.add(Event_Error, data);
  }

  async verifyAndPushEvent(events: EventLike[]): Promise<any> {
    try {
      let errors: any = [];
      for await (const event of events) {
        switch (event?.type) {
          case 'perf':
            if (perfValidate(event)) {
              await this.pushPerfEvent(event);
            } else {
              errors = errors.concat(perfValidate.errors);
            }
            break;
          case 'error':
            if (errorValidate(event)) {
              await this.pushErrorEvent(event);
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
    } catch (e) {
      return [e];
    }
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
}

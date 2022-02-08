import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EventLike } from './receiver.dto';
import { errorValidate, perfValidate } from './schema';
import {
  Queue_Event,
  Event_Error,
  Event_Perf,
  Event_FeedBack,
} from 'libs/shared/constant';

@Injectable()
export class ReceiverService {
  private readonly logger = new Logger(ReceiverService.name);

  constructor(@InjectQueue(Queue_Event) private queue: Queue) {}

  async pushPerfEvent(data: EventLike): Promise<void> {
    this.logger.debug(Event_Perf);

    const valid = perfValidate(data);
    if (!valid) {
      const msg = this.getErrorMessage(perfValidate.errors);
      throw new Error(msg);
    }
    await this.queue.add(Event_Perf, data);
  }

  async pushErrorEvent(data: EventLike): Promise<void> {
    this.logger.debug(Event_Error);

    const valid = errorValidate(data);
    if (!valid) {
      const msg = this.getErrorMessage(errorValidate.errors);
      throw new Error(msg);
    }
    await this.queue.add(Event_Error, data);
  }

  async pushFeedBackEvent(data: any): Promise<void> {
    this.logger.debug(Event_FeedBack);
    console.log(data);

    // await this.queue.add(Event_FeedBack, data);
  }

  async verifyAndPushEvent(events: EventLike[]): Promise<any> {
    let errors: string[] = [];
    for await (const event of events) {
      try {
        switch (event?.type) {
          case 'perf':
            await this.pushPerfEvent(event);
            break;
          case 'error':
            await this.pushErrorEvent(event);
            break;
          case 'feedback':
            await this.pushFeedBackEvent(event);
            break;
          case 'api':
            break;
          case 'res':
            break;
          case 'visit':
            break;
          default:
        }
      } catch (e) {
        errors = [...errors, e.message];
      }
    }

    return errors;
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

  getErrorMessage(errors: any[]): string {
    if (Array.isArray(errors)) {
      return errors.reduce((acc, cur) => {
        acc += `${cur.schemaPath} ${cur.message}`;
        return acc;
      }, '');
    }
    return '';
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  ErrorEventQueueName,
  EventQueue,
  PerfEventQueueName,
} from 'libs/shared/constant';
import { ErrorEvent, PerfEvent } from './receiver.dto';
import { dumpJson } from 'libs/shared';

@Injectable()
export class ReceiverService {
  private readonly logger = new Logger(ReceiverService.name);

  constructor(@InjectQueue(EventQueue) private readonly eventQueue: Queue) {}

  async handleEvent(data: { body: any; ip: string }) {
    try {
      const bodyData = JSON.parse(data.body);
      const context = bodyData.context;

      if (!context || !Array.isArray(bodyData.values)) {
        return;
      }

      const events = bodyData.values.map((value) => {
        const eventContent = value.content;
        const event_id = value.event_id;
        const timestamp = value.timestamp;
        const request = value.request;
        return {
          ...context,
          ...eventContent,
          event_id,
          ip: data.ip,
          timestamp,
          request,
        };
      });

      for await (const event of events) {
        switch (event.type) {
          case 'perf':
            await this.pushPerfEventToQueue(event);
            return;
          case 'error':
            await this.pushErrorEventToQueue(event);
            return;
          case 'api':
            return;
          case 'res':
            return;
          case 'visit':
            return;
          default:
        }
      }
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }

  async verifyEvent(data: any): Promise<any> {
    // redis cache get project info
    return data;
  }

  // error
  async pushErrorEventToQueue(data: ErrorEvent): Promise<any> {
    try {
      // await dumpJson('error', data);
      const result = await this.verifyEvent(data);
      await this.eventQueue.add(ErrorEventQueueName, result, {
        removeOnComplete: true,
      });
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }

  // perf
  async pushPerfEventToQueue(data: PerfEvent): Promise<any> {
    try {
      // await dumpJson('perf', data);
      const result = await this.verifyEvent(data);
      await this.eventQueue.add(PerfEventQueueName, result, {
        removeOnComplete: true,
      });
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }
}

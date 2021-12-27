import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReceiverService {
  private readonly logger = new Logger(ReceiverService.name);

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

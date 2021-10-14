import { Injectable } from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { PrefEvent, ErrorEvent } from './receiver.dto';

@Injectable()
export class SentryService {
  constructor(private readonly receiverService: ReceiverService) {}

  async storeDataAdapter(data: any) {
    if (data.exception) {
      const fmtData: ErrorEvent = {
        type: 'error',
        appKey: data?.sentry_key,
        event_id: data?.event_id,
        timestamp: data?.timestamp,
        sdk: {
          name: data?.sdk?.name,
          version: data?.sdk?.version,
        },
        ip: data?.ip,
        release: data?.release,
        environment: data?.environment,
        request: {
          url: data?.request?.url,
          referer: data?.request?.headers?.Referer,
          ua: data?.request?.headers?.['User-Agent'],
        },
        breadcrumbs: data?.breadcrumbs,
        exception: data?.exception,
      };
      await this.receiverService.pushToErrorEventQueue(fmtData);
    }
  }

  async envelopeDataAdapter(data: any) {
    if (data.measurements) {
      const fmtData: PrefEvent = {
        type: 'pref',
        appKey: data?.sentry_key,
        event_id: data?.event_id,
        timestamp: data?.timestamp,
        sdk: {
          name: data?.sdk?.name,
          version: data?.sdk?.version,
        },
        ip: data?.ip,
        measurements: {
          lcp: data?.measurements?.lcp?.value,
          fp: data?.measurements?.fp?.value,
          fcp: data?.measurements?.fcp?.value,
          ttfb: data?.measurements?.ttfb?.value,
        },
        release: data?.release,
        environment: data?.environment,
        request: {
          url: data?.request?.url,
          referer: data?.request?.headers?.Referer,
          ua: data?.request?.headers?.['User-Agent'],
        },
      };
      await this.receiverService.pushToPerfEventQueue(fmtData);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrefEvent, ErrorEvent } from './receiver.dto';

@Injectable()
export class SentryService {
  async storeDataAdapter(data: any) {
    if (!data.exception) return null;
    if (!data.sentry_key) return null;

    const pickErrorData: ErrorEvent = {
      type: 'error',
      appKey: data?.sentry_key,
      event_id: data?.event_id,
      timestamp: data?.timestamp * 1000,
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
    return pickErrorData;
  }

  async envelopeDataAdapter(data: any) {
    if (!data.measurements) return null;
    if (!data.sentry_key) return null;

    const pickData: PrefEvent = {
      type: 'pref',
      appKey: data?.sentry_key,
      event_id: data?.event_id,
      timestamp: data?.timestamp * 1000,
      sdk: {
        name: data?.sdk?.name,
        version: data?.sdk?.version,
      },
      ip: data?.ip,
      measurements: {
        lcp: data?.measurements?.lcp?.value,
        fp: data?.measurements?.fp?.value,
        fcp: data?.measurements?.fcp?.value,
        fid: data?.measurements?.fid?.value,
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
    return pickData;
  }
}

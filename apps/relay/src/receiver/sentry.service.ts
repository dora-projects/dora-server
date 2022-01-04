import { Injectable } from '@nestjs/common';
import { PerfEvent, ErrorEvent, ErrorValue } from './receiver.dto';

@Injectable()
export class SentryService {
  formatErrorValues(values): ErrorValue[] {
    if (Array.isArray(values)) {
      return values.map((item) => {
        const frames = item.stacktrace?.frames || [];

        item.stacktrace = {
          frames: frames.map((frame) => {
            return {
              url: frame.filename,
              func: frame.function,
              line: frame?.lineno,
              column: frame?.colno,
            };
          }),
        };
        return item;
      });
    }
    return null;
  }

  async storeDataAdapter(data: any) {
    if (!data.exception) return null;
    if (!data.sentry_key) return null;

    const values = this.formatErrorValues(data?.exception?.values);

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
      error: { values },
    };
    return pickErrorData;
  }

  async envelopeDataAdapter(data: any) {
    if (!data.measurements) return null;
    if (!data.sentry_key) return null;

    const pickData: PerfEvent = {
      type: 'perf',
      appKey: data?.sentry_key,
      event_id: data?.event_id,
      timestamp: data?.timestamp * 1000,
      sdk: {
        name: data?.sdk?.name,
        version: data?.sdk?.version,
      },
      ip: data?.ip,
      perf: {
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

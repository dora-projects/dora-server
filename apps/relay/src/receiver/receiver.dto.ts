export interface ExceptionFrame {
  colno: number;
  filename: string;
  function: string;
  lineno: number;
}

export interface Breadcrumb {
  timestamp: number;
  category: string;
  event_id: string;
  message: number;
}

export interface EventCommon {
  event_id: string;
  appKey: string;
  timestamp: number;
  ip: string;
  release: string;
  environment: string;
  sdk: {
    name: string;
    version: string;
  };
  request: {
    url: string;
    referer: string;
    ua: string;
  };
}

export type ErrorEvent = EventCommon & {
  type: 'error';
  breadcrumbs: Breadcrumb[];
  exception: {
    values: [
      {
        type: string;
        value: string;
        stacktrace: {
          frames: ExceptionFrame[];
        };
      },
    ];
  };
};

export type PrefEvent = EventCommon & {
  type: 'pref';
  measurements: {
    lcp: number;
    fp: number;
    fcp: number;
    ttfb: number;
  };
};

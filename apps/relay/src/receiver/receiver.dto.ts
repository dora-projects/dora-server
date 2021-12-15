export interface ExceptionFrame {
  url: string;
  func: string;
  args: any[];
  line: number;
  column: number;
}

export interface Breadcrumb {
  timestamp: number;
  category: string;
  event_id: string;
  message: number;
}

export interface EventLike {
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

  [key: string]: any;
}

export interface ErrorValue {
  type: string;
  value: string;
  stacktrace: {
    frames: ExceptionFrame[];
  };
}

export type ErrorEvent = EventLike & {
  type: string;
  breadcrumbs: Breadcrumb[];
  error: {
    values: ErrorValue[];
  };
};

export type PerfEvent = EventLike & {
  type: string;
  perf: {
    lcp: number;
    fp: number;
    fcp: number;
    fid: number;
    ttfb: number;
  };
};

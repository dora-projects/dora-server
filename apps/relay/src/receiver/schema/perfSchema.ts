import Ajv from 'ajv';

const ajv = new Ajv();

const perfEventSchema = {
  type: 'object',
  properties: {
    appKey: {
      type: 'string',
    },
    release: {
      type: 'string',
    },
    environment: {
      type: 'string',
    },
    sessionId: {
      type: 'string',
    },
    anonymousId: {
      type: 'string',
    },
    user: {
      type: 'null',
    },
    sdk: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        version: {
          type: 'string',
        },
      },
      required: ['name', 'version'],
    },
    type: {
      type: 'string',
    },
    subtype: {
      type: 'string',
    },
    perf: {
      type: 'object',
      properties: {
        ttfb: {
          type: 'number',
        },
        fp: {
          type: 'number',
        },
        fcp: {
          type: 'number',
        },
        fid: {
          type: 'number',
        },
        lcp: {
          type: 'number',
        },
        cls: {
          type: 'number',
        },
      },
    },
    event_id: {
      type: 'string',
    },
    ip: {
      type: 'string',
    },
    timestamp: {
      type: 'integer',
    },
    request: {
      type: 'object',
      properties: {
        referer: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
        ua: {
          type: 'string',
        },
      },
      required: ['url', 'ua'],
    },
  },
  required: [
    'appKey',
    'release',
    'environment',
    'sdk',
    'type',
    'perf',
    'event_id',
    'ip',
    'timestamp',
    'request',
  ],
};

export const perfValidate = ajv.compile(perfEventSchema);

import Ajv from 'ajv';

const ajv = new Ajv();

const errorEventSchema = {
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
    error: {
      type: 'object',
      properties: {
        values: {
          type: 'array',
        },
      },
      required: ['values'],
    },
    ip: {
      type: 'string',
    },
    event_id: {
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
      required: ['referer', 'url', 'ua'],
    },
  },
  required: [
    'appKey',
    'release',
    'environment',
    'timestamp',
    'sdk',
    'type',
    'error',
    'ip',
    'event_id',
    'request',
  ],
};

export const errorValidate = ajv.compile(errorEventSchema);

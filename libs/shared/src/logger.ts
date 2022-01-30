import * as winston from 'winston';
import { Format } from 'logform';
import { format } from 'winston';
import safeStringify from 'fast-safe-stringify';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const fileJsonFormat = (appName = 'Dora'): Format =>
  format.printf(({ context, level, timestamp, message, ms, ...meta }) => {
    if ('undefined' !== typeof timestamp) {
      // Only format the timestamp to a locale representation if it's ISO 8601 format. Any format
      // that is not a valid date string will throw, just ignore it (it will be printed as-is).
      try {
        if (timestamp === new Date(timestamp).toISOString()) {
          timestamp = new Date(timestamp).toLocaleString();
        }
      } catch (error) {
        // eslint-disable-next-line no-empty
      }
    }

    return safeStringify({
      app: appName,
      level,
      context,
      timestamp,
      ms,
      message,
      meta,
    });
  });

export const getLogConfig = (appName: string) => {
  return {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(appName, {
            prettyPrint: true,
          }),
        ),
        level: 'debug',
      }),
      new winston.transports.File({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          fileJsonFormat(appName),
        ),
        filename: 'logs/combined.log',
        level: 'info',
      }),
      new winston.transports.File({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          fileJsonFormat(appName),
        ),
        filename: 'logs/errors.log',
        level: 'error',
      }),
    ],
  };
};

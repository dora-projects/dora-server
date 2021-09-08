import * as parser from 'ua-parser-js';

export const userAgentParser = (ua: string) => {
  return parser(ua);
};

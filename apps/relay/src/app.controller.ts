import { Controller, Get } from '@nestjs/common';
import { dateFormatWeek, timeFormNow } from 'libs/shared';

const uptime = new Date().toUTCString();

@Controller()
export class AppController {
  @Get(['/', '/_health'])
  async health(): Promise<any> {
    return {
      app: 'relay',
      uptime: dateFormatWeek(uptime),
      formNow: timeFormNow(uptime),
    };
  }
}

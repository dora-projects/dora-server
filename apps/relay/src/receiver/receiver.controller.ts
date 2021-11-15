import { Controller, Get, Ip, Logger, Post, Req } from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { SentryService } from './sentry.service';
import { __DEV__, dumpJson, timeFormNow } from 'libs/shared';

const uptime = new Date().toISOString();

@Controller()
export class ReceiverController {
  private readonly logger = new Logger(ReceiverController.name);

  constructor(
    private readonly receiverService: ReceiverService,
    private readonly sentryService: SentryService,
  ) {}

  @Get()
  async test(): Promise<any> {
    return {
      app: 'relay',
      uptime,
      formNow: timeFormNow(uptime),
    };
  }

  @Post('/report')
  async report(): Promise<string> {
    // await this.eventService.handleEvent(req.body, ip);
    return 'ok';
  }

  @Post('api/:id/store')
  async sentryStore(@Ip() ip: string, @Req() req: any): Promise<string> {
    try {
      // query
      const { sentry_key, sentry_version } = req.query;

      // body
      const body = JSON.parse(req.body);

      const storeData = {
        sentry_key,
        sentry_version,
        ip,
        ...body,
      };

      //debug
      // if (__DEV__) {
      // await dumpJson(`api-store-${storeData?.type}`, storeData);
      // }

      const data = await this.sentryService.storeDataAdapter(storeData);
      if (data) {
        await this.receiverService.pushErrorEventToQueue(data);
      }
      return 'ok';
    } catch (e) {
      this.logger.error(e, e?.stack);
      return e;
    }
  }

  @Post('api/:id/envelope')
  async sentryEnvelope(@Ip() ip: string, @Req() req: any): Promise<string> {
    try {
      // query
      const { sentry_key, sentry_version } = req.query;

      // body
      const textBody = req.body;
      const result = {};
      if (textBody) {
        const allJson = textBody.split('\n');
        for (const jsonStr of allJson) {
          const json = JSON.parse(jsonStr);
          Object.assign(result, json);
        }
      }

      const envelopeData: any = {
        sentry_key,
        sentry_version,
        ip,
        ...result,
      };

      //debug
      // if (__DEV__) {
      //   await dumpJson(`api-envelope-${envelopeData?.type}`, envelopeData);
      // }

      const pickData = await this.sentryService.envelopeDataAdapter(
        envelopeData,
      );
      if (pickData) {
        await this.receiverService.pushPerfEventToQueue(pickData);
      }
      return 'ok';
    } catch (e) {
      this.logger.error(e, e?.stack);
      return e;
    }
  }
}

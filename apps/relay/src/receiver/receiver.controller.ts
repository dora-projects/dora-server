import { Controller, Get, Ip, Logger, Post, Req } from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { dumpJson } from 'libs/shared/utils';

@Controller()
export class ReceiverController {
  private readonly logger = new Logger(ReceiverController.name);

  constructor(private readonly reportService: ReceiverService) {}

  @Get()
  async getCounts(): Promise<any> {
    return await this.reportService.getJobCounts();
  }

  @Get('/jobs')
  async getJobs(): Promise<any> {
    return await this.reportService.getJobs();
  }

  // @Post('/report')
  // async report(@Ip() ip: string, @Req() req: any): Promise<string> {
  //   await this.eventService.handleEvent(req.body, ip);
  //   return 'ok';
  // }

  @Post('/api/:id/store')
  async sentryStore(@Ip() ip: string, @Req() req: any): Promise<string> {
    // await this.eventService.handleEvent(req.body, ip);
    console.log('--------------store------------------');
    console.log(req.query);
    console.log(JSON.parse(req.body));
    await dumpJson('store', JSON.parse(req.body));
    // const { sentry_key, sentry_version } = req.query;
    // console.log({ sentry_key, sentry_version });

    return 'ok';
  }

  @Post('/api/:id/envelope')
  async sentryEnvelope(@Ip() ip: string, @Req() req: any): Promise<string> {
    console.log('------------envelope--------------------');
    const { sentry_key, sentry_version } = req.query;
    console.log({ sentry_key, sentry_version });

    const textBody = req.body;
    const result = {};
    if (textBody) {
      const allJson = textBody.split('\n');
      for (const jsonStr of allJson) {
        const json = JSON.parse(jsonStr);
        Object.assign(result, json);
      }
    }

    await dumpJson('envelope', result);
    await this.reportService.convertSentryData(result);

    return 'ok';
  }
}

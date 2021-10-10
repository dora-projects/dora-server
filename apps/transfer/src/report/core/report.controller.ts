import { Controller, Get, Ip, Logger, Post, Req } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller()
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(private readonly reportService: ReportService) {}

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
      allJson.forEach((jsonStr) => {
        const json = JSON.parse(jsonStr);
        console.log(json);

        Object.assign(result, json);
      });
    }

    await this.reportService.convertSentryData(result);

    return 'ok';
  }
}

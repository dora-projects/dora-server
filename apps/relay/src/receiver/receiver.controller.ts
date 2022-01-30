import {
  Controller,
  Get,
  Ip,
  Logger,
  OnModuleInit,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import { ReceiverService } from './receiver.service';
import { SentryService } from './sentry.service';
import { ConfigService } from '@nestjs/config';
import * as terser from 'html-minifier-terser';

@Controller()
export class ReceiverController implements OnModuleInit {
  private readonly logger = new Logger(ReceiverController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly receiverService: ReceiverService,
    private readonly sentryService: SentryService,
  ) {}

  private errorPagesJs: string;

  async onModuleInit() {
    const errorPagesHtml = fs.readFileSync(
      join(process.cwd(), 'static/error_page/error.html'),
      'utf8',
    );
    const errorPagesJs = fs.readFileSync(
      join(process.cwd(), 'static/error_page/error.js'),
      'utf8',
    );
    const minifyHtml = await terser.minify(errorPagesHtml, {
      minifyCSS: true,
      collapseWhitespace: true,
    });
    this.errorPagesJs = errorPagesJs.replace('/*{{ template }}*/', minifyHtml);
  }

  @Post('/report')
  async report(
    @Ip() ip: string,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<any> {
    const events = await this.receiverService.formatData(req.body, ip);
    if (!events) {
      return res.status(400).send({ success: 'invalid data' });
    }

    const errResult = await this.receiverService.verifyAndPushEvent(events);
    if (errResult && errResult.length > 0) {
      return res.status(400).json({ errors: errResult });
    }

    return res.status(200).json({ success: true });
  }

  @Get('/api/embed/error-page')
  async errorPage(@Req() req: any, @Res() res: Response) {
    const BaseUrl = this.configService.get('dora_url');
    const resScript = this.errorPagesJs.replace(
      '/*{{ endpoint }}*/',
      BaseUrl + req.url,
    );

    return res.setHeader('content-type', 'text/javascript').send(resScript);
  }

  @Post('/api/embed/error-page')
  async errorPageSubmit(@Req() req: any, @Res() res: Response) {
    try {
      const data = {
        name: req.body.name,
        email: req.body.email,
        comments: req.body.comments,
        relEventId: req.query.eventId,
      };
      await this.receiverService.pushFeedBackEvent(data);
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  @Post('api/:id/store')
  async sentryStore(
    @Ip() ip: string,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const { sentry_key, sentry_version } = req.query;
      const body = JSON.parse(req.body);
      const storeData = { sentry_key, sentry_version, ip, ...body };

      //debug
      // if (__DEV__) {
      // await dumpJson(`api-store-${storeData?.type}`, storeData);
      // }

      const data = await this.sentryService.storeDataAdapter(storeData);
      if (data) {
        await this.receiverService.pushErrorEvent(data);
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      this.logger.error(e, e?.stack);
      return res.status(500).json({ error: e?.message });
    }
  }

  @Post('api/:id/envelope')
  async sentryEnvelope(
    @Ip() ip: string,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const { sentry_key, sentry_version } = req.query;
      const textBody = req.body;
      const result = {};
      if (textBody) {
        const allJson = textBody.split('\n');
        for (const jsonStr of allJson) {
          const json = JSON.parse(jsonStr);
          Object.assign(result, json);
        }
      }

      const envelopeData: any = { sentry_key, sentry_version, ip, ...result };

      //debug
      // if (__DEV__) {
      //   await dumpJson(`api-envelope-${envelopeData?.type}`, envelopeData);
      // }

      const pickData = await this.sentryService.envelopeDataAdapter(
        envelopeData,
      );

      if (pickData) {
        await this.receiverService.pushPerfEvent(pickData);
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      this.logger.error(e, e?.stack);
      return res.status(500).json({ error: e?.message });
    }
  }
}

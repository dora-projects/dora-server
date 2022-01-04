import {
  Controller,
  Get,
  Ip,
  Logger,
  OnModuleDestroy,
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
import { timeFormNow } from 'libs/shared';
import { EventLike } from './receiver.dto';
import { Message_Error, Message_Perf } from 'libs/shared/constant';
import { errorValidate, perfValidate } from './schema';
import { Kafka, Producer, logLevel } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import * as terser from 'html-minifier-terser';
import { KafkaLogger } from '@nestjs/microservices/helpers/kafka-logger';

const uptime = new Date().toISOString();

@Controller()
export class ReceiverController implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReceiverController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly receiverService: ReceiverService,
    private readonly sentryService: SentryService,
  ) {}

  private producer: Producer;
  private errorPagesJs: string;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'relay',
      logLevel: logLevel.WARN,
      brokers: this.configService.get('kafka.brokers'),
      logCreator: KafkaLogger.bind(null, this.logger),
    });
    this.producer = kafka.producer();
    await this.producer.connect();

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

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  // error
  async pushErrorEventToQueue(data: EventLike): Promise<any> {
    try {
      await this.producer.send({
        topic: Message_Error,
        messages: [{ key: Message_Error, value: JSON.stringify(data) }],
      });
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }

  // perf
  async pushPerfEventToQueue(data: EventLike): Promise<any> {
    try {
      await this.producer.send({
        topic: Message_Perf,
        messages: [{ key: Message_Perf, value: JSON.stringify(data) }],
      });
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }

  async verifyAndPushEvent(events: EventLike[]): Promise<any> {
    let errors: any = [];

    for await (const event of events) {
      switch (event?.type) {
        case 'perf':
          if (perfValidate(event)) {
            await this.pushPerfEventToQueue(event);
          } else {
            errors = errors.concat(perfValidate.errors);
          }
          break;
        case 'error':
          if (errorValidate(event)) {
            await this.pushErrorEventToQueue(event);
          } else {
            errors = errors.concat(errorValidate.errors);
          }
          break;
        case 'api':
          break;
        case 'res':
          break;
        case 'visit':
          break;
        default:
      }
    }

    return errors;
  }

  @Get()
  async info(): Promise<any> {
    return {
      app: 'relay',
      uptime,
      formNow: timeFormNow(uptime),
    };
  }

  @Post('/report')
  async report(
    @Ip() ip: string,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<any> {
    const events = await this.receiverService.formatData(req.body, ip);
    if (!events) {
      return res.send({ success: 'invalid data' });
    }

    const errResult = await this.verifyAndPushEvent(events);
    if (errResult && errResult.length > 0) return errResult;

    return res.json({ success: true });
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
    // todo
    console.log(req.body);
    return res.status(200).json({});
  }

  @Post('api/:id/store')
  async sentryStore(@Ip() ip: string, @Req() req: any): Promise<any> {
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
        await this.pushErrorEventToQueue(data);
      }
      return { success: true };
    } catch (e) {
      this.logger.error(e, e?.stack);
      return e;
    }
  }

  @Post('api/:id/envelope')
  async sentryEnvelope(@Ip() ip: string, @Req() req: any): Promise<any> {
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
        await this.pushPerfEventToQueue(pickData);
      }
      return { success: true };
    } catch (e) {
      this.logger.error(e, e?.stack);
      return e;
    }
  }
}

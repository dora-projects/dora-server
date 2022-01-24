if (process.env.XPROFILER_ENABLE) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('xprofiler').start();
}

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as chalk from 'chalk';
import { getLogConfig } from 'libs/shared/logger';

const banner = (m) => `
██████╗ ██████╗  ██████╗  ██████╗███████╗███████╗███████╗
██╔══██╗██╔══██╗██╔═══██╗██╔════╝██╔════╝██╔════╝██╔════╝
██████╔╝██████╔╝██║   ██║██║     █████╗  ███████╗███████╗
██╔═══╝ ██╔══██╗██║   ██║██║     ██╔══╝  ╚════██║╚════██║
██║     ██║  ██║╚██████╔╝╚██████╗███████╗███████║███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚═════╝╚══════╝╚══════╝╚══════╝
powered by Dora@2021
${m}

`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(getLogConfig('process')),
  });

  const configService = app.get(ConfigService);
  await app.listen(configService.get('process_port'));

  console.log(chalk.green(banner(`process started at ${await app.getUrl()}`)));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

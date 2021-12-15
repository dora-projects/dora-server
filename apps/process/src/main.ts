if (process.env.XPROFILER_ENABLE) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('xprofiler').start();
}

import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
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
  await NestFactory.createApplicationContext(AppModule, {
    logger: WinstonModule.createLogger(getLogConfig('process')),
  });
  console.log(chalk.green(banner('process started！')));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

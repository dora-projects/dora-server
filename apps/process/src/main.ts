// eslint-disable-next-line @typescript-eslint/no-var-requires
require('xprofiler').start();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as chalk from 'chalk';

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
  await NestFactory.createApplicationContext(AppModule);
  console.log(chalk.green(banner('process started！')));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

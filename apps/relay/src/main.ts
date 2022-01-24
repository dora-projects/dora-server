if (process.env.XPROFILER_ENABLE) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('xprofiler').start();
}

import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import { getLogConfig } from 'libs/shared/logger';

const banner = (m) => `
██████╗ ███████╗██╗      █████╗ ██╗   ██╗
██╔══██╗██╔════╝██║     ██╔══██╗╚██╗ ██╔╝
██████╔╝█████╗  ██║     ███████║ ╚████╔╝ 
██╔══██╗██╔══╝  ██║     ██╔══██║  ╚██╔╝  
██║  ██║███████╗███████╗██║  ██║   ██║   
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   
powered by Dora@2021 
${m}

`;

/**
 * relay
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(getLogConfig('relay')),
  });
  app.enableCors({
    origin: (ori, callback) => {
      callback(null, ori);
    },
  });
  app.use(bodyParser.text());

  const configService = app.get(ConfigService);

  await app.listen(configService.get('relay_port'));

  console.log(chalk.green(banner(`relay started at ${await app.getUrl()}`)));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

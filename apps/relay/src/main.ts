import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';

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
 * todo 限流
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.text());

  const configService = app.get(ConfigService);
  const port = configService.get('relay_port');

  await app.listen(port);

  console.log(chalk.green(banner(`relay started at ${await app.getUrl()}`)));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { RelayHttpPort } from 'libs/shared/constant';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';

/**
 * relay 接收处理上报数据
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.text());
  await app.listen(RelayHttpPort);

  console.log(chalk.green(`relay started at ${await app.getUrl()}`));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

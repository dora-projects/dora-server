import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProcessHttpPort } from 'libs/shared/constant';
import * as chalk from 'chalk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ProcessHttpPort);

  console.log(chalk.green(`process started at ${await app.getUrl()}`));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AlertHttpPort } from 'libs/shared/constant';
import * as chalk from 'chalk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(AlertHttpPort);

  console.log(chalk.green(`alert started at ${await app.getUrl()}`));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

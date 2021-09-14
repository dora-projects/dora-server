import { NestFactory } from '@nestjs/core';
import { TransferHttpPort } from 'libs/shared/constant';
import { AppModule } from './app.module';
import * as chalk from 'chalk';

/**
 * transfer 接收处理上报数据
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/transfer');

  await app.listen(TransferHttpPort);

  console.log(chalk.green(`transfer started at ${await app.getUrl()}`));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

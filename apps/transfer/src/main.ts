import { NestFactory } from '@nestjs/core';
import { TransferHttpPort } from 'libs/shared/constant';
import { AppModule } from './app.module';

/**
 * transfer 接收处理上报数据
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/transfer');

  await app.listen(TransferHttpPort);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

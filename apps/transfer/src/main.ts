import { NestFactory } from '@nestjs/core';
import { TransferHttpPort } from 'libs/shared/constant';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/transfer');
  await app.listen(TransferHttpPort);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { ManagerHttpPort } from 'libs/shared/constant';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ManagerHttpPort);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { ManagerHttpPort } from 'libs/shared/constant';
import { AppModule } from './app.module';

/**
 * manager 管理平台
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/manager');

  await app.listen(ManagerHttpPort);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

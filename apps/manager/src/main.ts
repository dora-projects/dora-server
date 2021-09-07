import { NestFactory } from '@nestjs/core';
import { ManagerModule } from './manager.module';

async function bootstrap() {
  const app = await NestFactory.create(ManagerModule);
  await app.listen(3002);
}
bootstrap();

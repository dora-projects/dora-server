import { NestFactory } from '@nestjs/core';
import { AlertModule } from './alert.module';

async function bootstrap() {
  const app = await NestFactory.create(AlertModule);
  await app.listen(3003);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

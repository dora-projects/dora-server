import { NestFactory } from '@nestjs/core';
import { TransferModule } from './transfer.module';

async function bootstrap() {
  const app = await NestFactory.create(TransferModule);
  await app.listen(3001);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as chalk from 'chalk';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
  console.log(chalk.green(`process started！`));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

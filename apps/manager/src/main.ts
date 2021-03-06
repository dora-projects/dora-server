if (process.env.XPROFILER_ENABLE) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('xprofiler').start();
}

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as chalk from 'chalk';
import { AppModule } from './app.module';
import { getLogConfig } from 'libs/shared/logger';
import { AllExceptionFilter } from './common/all-exception.filter';

const banner = (m) => `
███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗
████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝
██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  
██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  
██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
powered by Dora@2021
${m}

`;

const setupSwagger = (app) => {
  const config = new DocumentBuilder()
    .addBearerAuth({
      type: 'http',
      bearerFormat: 'JWT',
    })
    .setTitle('Dora Api Docs')
    .setDescription('The Dora Server Api description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};

const configure = async (app) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: (
      requestOrigin: string,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      callback(null, true);
    },
    maxAge: 600,
    credentials: true,
  });

  setupSwagger(app);

  app.useGlobalFilters(new AllExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get('manager_port');

  await app.listen(port);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(getLogConfig('manager')),
  });
  await configure(app);

  app.enableShutdownHooks();

  console.log(chalk.green(banner(`manager started at ${await app.getUrl()}`)));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

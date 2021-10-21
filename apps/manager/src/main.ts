import * as chalk from 'chalk';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ManagerHttpPort } from 'libs/shared/constant';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/all-exception.filter';

const banner = `
███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗
████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝
██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  
██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  
██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
                  
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

/**
 * manager 管理平台
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(ManagerHttpPort);

  console.log(
    chalk.green(`
${banner}
manager started at ${await app.getUrl()}`),
  );
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

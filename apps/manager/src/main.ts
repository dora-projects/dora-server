import * as chalk from 'chalk';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ManagerHttpPort } from 'libs/shared/constant';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filter';

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
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  setupSwagger(app);

  await app.listen(ManagerHttpPort);

  const banner = `
███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗
████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝
██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  
██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  
██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
                  
`;

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

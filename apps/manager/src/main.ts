import * as chalk from 'chalk';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ManagerHttpPort } from 'libs/shared/constant';
import { AppModule } from './app.module';

/**
 * manager 管理平台
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Dora Api Docs')
    .setDescription('The Dora Server Api description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

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

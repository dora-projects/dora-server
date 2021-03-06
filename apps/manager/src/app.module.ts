import { MiddlewareConsumer, Module } from '@nestjs/common';

import { MyConfigModule } from 'libs/datasource/config';
import { MyElasticModule, PrismaService, QueueModule } from 'libs/datasource';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/logger.middleware';

import { AnalysisModule } from './analysis/analysis.module';
import { ArtifactModule } from './artifact/artifact.module';
import { IssuesModule } from './issues/issues.module';
import { ProjectModule } from './project/project.module';
import { FileModule } from './file/file.module';
import { SourcemapModule } from './sourcemap/sourcemap.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SystemModule } from './system/system.module';
import { AlertModule } from './alert/alert.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    MyConfigModule,
    MyElasticModule,
    QueueModule,
    AuthModule,
    ArtifactModule,
    UserModule,
    ProjectModule,
    FileModule,
    AlertModule,
    AnalysisModule,
    IssuesModule,
    SourcemapModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

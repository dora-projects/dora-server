import { MiddlewareConsumer, Module } from '@nestjs/common';

import { MyConfigModule } from 'libs/datasource/config';
import { MyDatabase, MyElasticModule } from 'libs/datasource';
import { AppService, AppShutdownService } from './app.service';
import { LoggerMiddleware } from './common/logger.middleware';

import { AnalysisModule } from './analysis/analysis.module';
import { IssuesModule } from './issues/issues.module';
import { ProjectModule } from './project/project.module';
import { SourcemapModule } from './sourcemap/sourcemap.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SystemModule } from './system/system.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    MyElasticModule,
    MyConfigModule,
    MyDatabase,
    AuthModule,
    UserModule,
    ProjectModule,
    AlertModule,
    AnalysisModule,
    IssuesModule,
    SourcemapModule,
    SystemModule,
  ],
  providers: [AppService, AppShutdownService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

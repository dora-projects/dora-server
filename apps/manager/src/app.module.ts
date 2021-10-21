import { MiddlewareConsumer, Module } from '@nestjs/common';

import { MyConfigModule } from 'libs/datasource/config';
import { MyBullModule, MyDatabase, MyElasticModule } from 'libs/datasource';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/logger.middleware';

import { AnalysisModule } from './analysis/analysis.module';
import { IssuesModule } from './issues/issues.module';
import { ProjectModule } from './project/project.module';
import { SourcemapModule } from './sourcemap/sourcemap.module';
// import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SystemModule } from './system/system.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    MyBullModule,
    MyElasticModule,
    MyConfigModule,
    MyDatabase,
    AuthModule,
    UserModule,
    // TeamModule,
    ProjectModule,
    AlertModule,
    AnalysisModule,
    IssuesModule,
    SourcemapModule,
    SystemModule,
  ],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

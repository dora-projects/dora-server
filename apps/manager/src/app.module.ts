import { Module } from '@nestjs/common';

import { MyConfigModule } from 'libs/datasource/config';
import { MyBullModule, MyDatabase, MyElasticModule } from 'libs/datasource';

import { AnalysisModule } from './analysis/analysis.module';
import { IssuesModule } from './issues/issues.module';
import { ProjectModule } from './project/project.module';
import { SourcemapModule } from './sourcemap/sourcemap.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [
    MyBullModule,
    MyElasticModule,
    MyConfigModule,
    MyDatabase,
    AuthModule,
    UserModule,
    TeamModule,
    ProjectModule,
    AnalysisModule,
    IssuesModule,
    SourcemapModule,
    SystemModule,
  ],
})
export class AppModule {}

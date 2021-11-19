import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyService } from './notify.service';
import { NotifyProcessor } from './notify.processor';
import { MailService } from 'apps/manager/src/common/service/mail.service';
import { DingTalkService } from 'apps/manager/src/common/service/dingTalk.service';
import { ProjectModule } from 'apps/manager/src/project/project.module';
import { AlertModule } from 'apps/manager/src/alert/alert.module';

import {
  AlertBullQueueModule,
  AlertContact,
  AlertLog,
  AlertRule,
  MyCacheModule,
  MyDatabase,
  MyElasticModule,
  Project,
  ProjectRoles,
} from 'libs/datasource';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectRoles,
      AlertRule,
      AlertContact,
      AlertLog,
    ]),
    MyCacheModule,
    MyElasticModule,
    MyDatabase,
    AlertBullQueueModule,
    ProjectModule,
    AlertModule,
  ],
  providers: [NotifyService, NotifyProcessor, MailService, DingTalkService],
})
export class NotifyModule {}

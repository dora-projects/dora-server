import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyService } from './notify.service';
import { NotifyProcessor } from './notify.processor';
import { MailService } from 'apps/manager/src/common/service/mail.service';
import { DingTalkService } from 'apps/manager/src/common/service/dingTalk.service';
import { AlertService } from 'apps/manager/src/alert/alert.service';
import { ProjectService } from 'apps/manager/src/project/project.service';
import {
  AlertBullQueueModule,
  AlertContact,
  AlertRule,
  MyCacheModule,
  MyDatabase,
  MyElasticModule,
  Project,
} from 'libs/datasource';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, AlertRule, AlertContact]),
    MyCacheModule,
    MyElasticModule,
    MyDatabase,
    AlertBullQueueModule,
  ],
  providers: [
    NotifyService,
    NotifyProcessor,
    MailService,
    DingTalkService,
    AlertService,
    ProjectService,
  ],
})
export class NotifyModule {}

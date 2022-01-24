import { Module } from '@nestjs/common';
import { NotifyProcess } from './notify.process';
import { NotifyService } from './notify.service';
import { MailService } from 'apps/manager/src/common/service/mail.service';
import { DingTalkService } from 'apps/manager/src/common/service/dingTalk.service';
import { AlertService } from 'apps/manager/src/alert/alert.service';
import { ProjectService } from 'apps/manager/src/project/project.service';

import {
  MyCacheModule,
  MyElasticModule,
  PrismaService,
  registerQueueAlert,
} from 'libs/datasource';

@Module({
  imports: [registerQueueAlert, MyCacheModule, MyElasticModule],
  providers: [
    NotifyProcess,
    PrismaService,
    NotifyService,
    MailService,
    DingTalkService,
    AlertService,
    ProjectService,
  ],
})
export class NotifyModule {}

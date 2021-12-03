import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyProcessor } from './notify.processor';
import { MailService } from 'apps/manager/src/common/service/mail.service';
import { DingTalkService } from 'apps/manager/src/common/service/dingTalk.service';
import { ProjectModule } from 'apps/manager/src/project/project.module';
import { AlertModule } from 'apps/manager/src/alert/alert.module';

import {
  AlertBullQueueModule,
  MyCacheModule,
  MyElasticModule,
  PrismaService,
} from 'libs/datasource';

@Module({
  imports: [
    MyCacheModule,
    MyElasticModule,
    AlertBullQueueModule,
    ProjectModule,
    AlertModule,
  ],
  providers: [
    PrismaService,
    NotifyService,
    NotifyProcessor,
    MailService,
    DingTalkService,
  ],
})
export class NotifyModule {}

import { Module } from '@nestjs/common';
import { IssueController } from './notify.controller';
import { NotifyService } from './notify.service';
import { MailService } from 'apps/manager/src/common/service/mail.service';
import { DingTalkService } from 'apps/manager/src/common/service/dingTalk.service';
import { ProjectModule } from 'apps/manager/src/project/project.module';
import { AlertModule } from 'apps/manager/src/alert/alert.module';

import { MyCacheModule, MyElasticModule, PrismaService } from 'libs/datasource';
import { KafkaModule } from 'libs/datasource/kafka';

@Module({
  imports: [
    KafkaModule,
    MyCacheModule,
    MyElasticModule,
    ProjectModule,
    AlertModule,
  ],
  controllers: [IssueController],
  providers: [PrismaService, NotifyService, MailService, DingTalkService],
})
export class NotifyModule {}

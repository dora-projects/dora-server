import { Module } from '@nestjs/common';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';
import { MailService } from 'apps/manager/src/common/service/mail.service';
import { DingTalkService } from 'apps/manager/src/common/service/dingTalk.service';
import { AlertService } from 'apps/manager/src/alert/alert.service';
import { ProjectService } from 'apps/manager/src/project/project.service';

import { MyCacheModule, MyElasticModule, PrismaService } from 'libs/datasource';
import { KafkaModule } from 'libs/datasource/kafka';

@Module({
  imports: [KafkaModule, MyCacheModule, MyElasticModule],
  controllers: [NotifyController],
  providers: [
    PrismaService,
    NotifyService,
    MailService,
    DingTalkService,
    AlertService,
    ProjectService,
  ],
})
export class NotifyModule {}

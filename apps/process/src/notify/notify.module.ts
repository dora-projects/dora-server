import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyService } from './notify.service';
import { NotifyProcessor } from './notify.processor';
import { MailService } from './mail.service';
import { AlertService } from 'apps/manager/src/alert/alert.service';
import { ProjectService } from 'apps/manager/src/project/project.service';
import {
  AlertBullQueueModule,
  AlertContact,
  AlertRule,
  MyDatabase,
  MyElasticModule,
  Project,
} from 'libs/datasource';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, AlertRule, AlertContact]),
    AlertBullQueueModule,
    MyElasticModule,
    MyDatabase,
  ],
  providers: [
    NotifyService,
    NotifyProcessor,
    MailService,
    AlertService,
    ProjectService,
  ],
})
export class NotifyModule {}

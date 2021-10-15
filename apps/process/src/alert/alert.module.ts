import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertService } from './alert.service';
import { AlertProcessor } from './alert.processor';
import { MailService } from './mail.service';
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
  providers: [AlertService, AlertProcessor, MailService],
})
export class AlertModule {}

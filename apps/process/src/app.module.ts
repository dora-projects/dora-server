import { Module } from '@nestjs/common';
import { MyConfigModule, QueueModule } from 'libs/datasource';

import { EventModule } from './event/event.module';
import { IssueModule } from './issue/issue.module';
import { NotifyModule } from './notify/notify.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    MyConfigModule,
    QueueModule,
    EventModule,
    IssueModule,
    NotifyModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

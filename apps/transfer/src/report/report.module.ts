import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { ReportController } from './core/report.controller';
import { ReportService } from './core/report.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'event',
    }),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}

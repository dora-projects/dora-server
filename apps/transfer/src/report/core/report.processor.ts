import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('event')
export class ReportProcessor {
  private readonly logger = new Logger(ReportProcessor.name);

  @Process('event-report')
  handleTranscode(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}

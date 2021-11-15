import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { AlertQueue } from 'libs/shared/constant';
import { NotifyService } from './notify.service';

@Processor(AlertQueue)
export class NotifyProcessor {
  constructor(private readonly alertService: NotifyService) {}

  private readonly logger = new Logger(NotifyProcessor.name);

  @Process()
  async receiveErrorEvent(job: Job) {
    try {
      await this.alertService.handleErrorEvent(job.data);
    } catch (e) {
      this.logger.error(e, e?.stack);
      await job.moveToFailed({ message: e?.message }, true);
    }
  }
}

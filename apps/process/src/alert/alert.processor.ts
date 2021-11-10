import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { AlertQueue } from 'libs/shared/constant';
import { AlertService } from './alert.service';

@Processor(AlertQueue)
export class AlertProcessor {
  constructor(private readonly alertService: AlertService) {}

  private readonly logger = new Logger(AlertProcessor.name);

  @Process()
  async handleAlertErrorMessage(job: Job) {
    try {
      this.logger.debug('AlertProcessor got error data!');
      // check rules
      // todo 优化
      await this.alertService.checkProjectAlertRules(job.data);
    } catch (e) {
      this.logger.error(e);
      await job.moveToFailed({ message: e?.message }, true);
    }
  }
}

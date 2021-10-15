import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { AlertErrorQueueName, AlertQueueName } from 'libs/shared/constant';
import { AlertService } from './alert.service';

@Processor(AlertQueueName)
export class AlertProcessor {
  constructor(private readonly alertService: AlertService) {}

  private readonly logger = new Logger(AlertProcessor.name);

  @Process(AlertErrorQueueName)
  async handleAlertErrorMessage(job: Job) {
    try {
      this.logger.debug('AlertProcessor got error data!');
      await this.alertService.throttleCheck(job.data);
    } catch (e) {
      this.logger.error(e);
      await job.moveToFailed({ message: e?.message }, true);
    }
  }
}

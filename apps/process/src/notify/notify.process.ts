import { Logger } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { Process, Processor } from '@nestjs/bull';
import { Queue_Alert } from 'libs/shared/constant';
import { Job } from 'bull';

@Processor(Queue_Alert)
export class NotifyProcess {
  constructor(private readonly notifyService: NotifyService) {}

  private readonly logger = new Logger(NotifyProcess.name);

  @Process()
  async alertMessage(job: Job<unknown>) {
    try {
      const event = job?.data;
      if (!event) return;
      await this.notifyService.handleErrorEvent(event);
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }
}

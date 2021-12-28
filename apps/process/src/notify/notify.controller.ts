import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotifyService } from './notify.service';
import { Event_Alert } from 'libs/shared/constant';

@Controller()
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  private readonly logger = new Logger(NotifyController.name);

  @EventPattern(Event_Alert)
  async alertMessage(data: Record<string, unknown>) {
    try {
      const event = data?.value;
      if (!event) return;
      await this.notifyService.handleErrorEvent(event);
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }
}

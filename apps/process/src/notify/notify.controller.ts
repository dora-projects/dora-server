import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotifyService } from './notify.service';
import { Message_Alert } from 'libs/shared/constant';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';

@Controller()
export class IssueController {
  constructor(private readonly notifyService: NotifyService) {}

  private readonly logger = new Logger(IssueController.name);

  @MessagePattern(Message_Alert)
  async alertMessage(@Payload() message: KafkaMessage) {
    try {
      await this.notifyService.handleErrorEvent(message.value);
    } catch (e) {
      return e;
    }
  }
}

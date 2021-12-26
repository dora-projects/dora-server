import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { NotifyService } from './notify.service';
import { KAFKA_SERVICE } from 'libs/datasource/kafka';
import { Message_Alert } from 'libs/shared/constant';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';

@Controller()
export class IssueController implements OnModuleInit {
  private readonly logger = new Logger(IssueController.name);

  constructor(
    private readonly notifyService: NotifyService,
    @Inject(KAFKA_SERVICE)
    private clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf(Message_Alert);
    await this.clientKafka.connect();
  }

  @MessagePattern(Message_Alert)
  async alertMessage(@Payload() message: KafkaMessage) {
    try {
      await this.notifyService.handleErrorEvent(message.value);
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }
}

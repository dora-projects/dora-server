import * as lodash from 'lodash';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'libs/datasource/prisma.service';
import { Issue } from '@prisma/client';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Message_Issue } from 'libs/shared/constant';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { KAFKA_SERVICE } from 'libs/datasource/kafka';

@Injectable()
export class IssueService implements OnModuleInit {
  private readonly logger = new Logger(IssueService.name);

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(KAFKA_SERVICE)
    private clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf(Message_Issue);
    await this.clientKafka.connect();
  }

  @MessagePattern(Message_Issue)
  async issueMessage(@Payload() message: KafkaMessage) {
    try {
      const event = message.value;
      await this.createIssueIfNotExist(event);
      // await dumpJson('Issue_', job);
    } catch (e) {
      this.logger.error(e, e?.stack);
    }
  }

  async createIssueIfNotExist(event): Promise<Issue> {
    const { appKey, fingerprint, release, environment, timestamp } = event;
    const url = lodash.get(event, 'request.url');

    const item = await this.prismaService.issue.findUnique({
      where: {
        fingerprint_appKey: {
          fingerprint,
          appKey,
        },
      },
    });
    // update
    if (item) {
      return await this.prismaService.issue.update({
        where: {
          fingerprint_appKey: {
            fingerprint,
            appKey,
          },
        },
        data: {
          url,
          recently: new Date(timestamp),
          total: ++item.total,
        },
      });
    } else {
      // create
      const type = lodash.get(event, 'error.values[0].type');
      const value = lodash.get(event, 'error.values[0].value');

      return await this.prismaService.issue.create({
        data: {
          appKey,
          fingerprint,
          type,
          value,
          environment,
          release,
          url,
          total: 1,
          recently: new Date(timestamp),
        },
      });
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertContact, AlertRule, Project } from 'libs/datasource';
import { sleep } from 'libs/shared';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(AlertContact)
    private readonly alertContactRepository: Repository<AlertContact>,
    @InjectRepository(AlertRule)
    private readonly alertRuleRepository: Repository<AlertRule>,
  ) {}

  private readonly logger = new Logger(AlertService.name);

  async checkProjectAlertRules(data: any) {
    await sleep(3000);
    this.logger.debug('-----------checkAlertRules----------');
  }

  // 缓存
  async getProjectRules(appKey: string): Promise<string> {
    return 'Hello alert!';
  }

  async isTriggerProjectRules(): Promise<string> {
    return 'Hello alert!';
  }

  async notificationToUser(): Promise<string> {
    return '';
  }
}

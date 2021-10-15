import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertContact, AlertRule, Project } from 'libs/datasource';
import { throttle } from 'lodash';
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

  private async _checkProjectAlertRules(data: any) {
    await sleep(3000);
    this.logger.debug('-----------throttle checkAlertRules----------');
  }

  public throttleCheck = throttle(this._checkProjectAlertRules, 5000);

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

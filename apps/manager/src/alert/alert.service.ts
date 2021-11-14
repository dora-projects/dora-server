import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { AlertContact, AlertLog, AlertRule } from 'libs/datasource';
import { Between, Connection, Repository, UpdateResult } from 'typeorm';
import { AddRuleDto, UpdateRuleDto } from './alert.dto';

@Injectable()
export class AlertService {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(AlertRule)
    private readonly alertRuleRepository: Repository<AlertRule>,
    @InjectRepository(AlertLog)
    private readonly alertLogRepository: Repository<AlertLog>,
    @InjectRepository(AlertContact)
    private readonly alertContactRepository: Repository<AlertContact>,
  ) {}

  async createRule(addRuleDto: AddRuleDto): Promise<AlertRule> {
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    let err;
    try {
      const rule = new AlertRule();
      rule.name = addRuleDto.name;
      rule.filter = addRuleDto.filter;
      rule.thresholdsTime = addRuleDto.thresholdsTime;
      rule.thresholdsOperator = addRuleDto.thresholdsOperator;
      rule.thresholdsQuota = addRuleDto.thresholdsQuota;
      rule.silence = addRuleDto.silence;
      const result = await runner.manager.save(rule);

      await runner.manager
        .createQueryBuilder()
        .relation(AlertRule, 'project')
        .of(rule)
        .set(addRuleDto.projectId);

      await runner.commitTransaction();
      return result;
    } catch (e) {
      err = e;
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
    return err;
  }

  async updateRule(updateRuleDto: UpdateRuleDto): Promise<UpdateResult> {
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    let err;
    try {
      const rule = await this.alertRuleRepository.update(
        { id: updateRuleDto.id },
        {
          name: updateRuleDto.name,
          filter: updateRuleDto.filter,
          thresholdsTime: updateRuleDto.thresholdsTime,
          thresholdsOperator: updateRuleDto.thresholdsOperator,
          thresholdsQuota: updateRuleDto.thresholdsQuota,
          silence: updateRuleDto.silence,
        },
      );
      await runner.manager
        .createQueryBuilder()
        .relation(AlertRule, 'project')
        .of(rule)
        .set(updateRuleDto.projectId);

      await runner.commitTransaction();
      return rule;
    } catch (e) {
      err = e;
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
    return err;
  }

  async deleteRule(ruleId: number): Promise<void> {
    await this.alertRuleRepository.delete(ruleId);
  }

  async queryRule(projectId: number): Promise<AlertRule[]> {
    return await this.alertRuleRepository
      .createQueryBuilder('rule')
      .where('rule.projectId = :id', { id: projectId })
      .leftJoinAndSelect('rule.contacts', 'contact')
      .leftJoinAndSelect('rule.logs', 'logs')
      .leftJoinAndSelect('contact.user', 'user')
      .getMany();
  }

  async toggleRule(ruleId: number, open: boolean): Promise<UpdateResult> {
    return await this.alertRuleRepository.update({ id: ruleId }, { open });
  }

  async addRuleContact(ruleId: number, userId: number): Promise<AlertContact> {
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    let err;
    try {
      // todo 扩展字段 webhook 支持 钉钉 飞书 等
      const contact = new AlertContact();
      const result = await runner.manager.save(contact);

      await runner.manager
        .createQueryBuilder()
        .relation(AlertContact, 'rule')
        .of(contact)
        .set(ruleId);

      if (userId) {
        await runner.manager
          .createQueryBuilder()
          .relation(AlertContact, 'user')
          .of(contact)
          .set(userId);
      }

      await runner.commitTransaction();
      return result;
    } catch (e) {
      err = e;
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
    return err;
  }

  async updateRuleContact(ruleId: number, userIds: number[]): Promise<void> {
    const contacts = await this.getRuleContacts(ruleId);
    const contactIds = contacts.map((c) => c.id);
    if (Array.isArray(contactIds)) {
      contactIds.every(async (contactId) => {
        await this.removeRuleContact(contactId);
      });
    }
    if (Array.isArray(userIds)) {
      userIds.every(async (userId) => {
        await this.addRuleContact(ruleId, userId);
      });
    }
  }

  async getRuleContacts(ruleId: number): Promise<AlertContact[]> {
    return await this.alertContactRepository
      .createQueryBuilder('contact')
      .where('contact.ruleId = :id', { id: +ruleId })
      .leftJoinAndSelect('contact.user', 'user')
      .leftJoinAndSelect('contact.rule', 'rule')
      .getMany();
  }

  async removeRuleContact(contactId: number): Promise<void> {
    await this.alertContactRepository.delete({ id: contactId });
  }

  async createAlertLog(
    ruleId: number,
    projectId: number,
    content: string,
  ): Promise<AlertLog> {
    const log = new AlertLog();
    log.content = content;
    const logResult = await this.alertLogRepository.save(log);

    await this.alertLogRepository
      .createQueryBuilder()
      .relation(AlertLog, 'rule')
      .of(logResult)
      .set(ruleId);

    await this.alertLogRepository
      .createQueryBuilder()
      .relation(AlertLog, 'project')
      .of(logResult)
      .set(projectId);

    return logResult;
  }

  async queryAlertLogs(
    projectId: number,
    from: number,
    to: number,
  ): Promise<AlertLog[]> {
    return await this.alertLogRepository
      .createQueryBuilder('log')
      .where('log.projectId = :id', { id: projectId })
      .andWhere({
        createdAt: Between(new Date(+from), new Date(+to)),
      })
      .leftJoinAndSelect('log.rule', 'rule')
      .getMany();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { AlertContact, AlertRule } from 'libs/datasource';
import { Connection, Repository, UpdateResult } from 'typeorm';
import { AddRuleDto } from './alert.dto';

@Injectable()
export class AlertService {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(AlertRule)
    private readonly alertRuleRepository: Repository<AlertRule>,
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
      rule.filterEvent = addRuleDto.filterEvent;
      rule.interval = addRuleDto.interval;
      rule.thresholdsType = addRuleDto.thresholdsType;
      rule.thresholdsCount = addRuleDto.thresholdsCount;
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

  async deleteRule(ruleId: number): Promise<void> {
    await this.alertRuleRepository.delete(ruleId);
  }

  async queryByProjectId(projectId: number): Promise<AlertRule[]> {
    return await this.alertRuleRepository
      .createQueryBuilder('rule')
      .where('rule.projectId = :id', { id: projectId })
      .leftJoinAndSelect('rule.contacts', 'contact')
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
}

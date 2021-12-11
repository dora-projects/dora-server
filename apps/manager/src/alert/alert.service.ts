import { Injectable } from '@nestjs/common';
import { AddRuleDto, UpdateRuleDto } from './alert.dto';
import { PrismaService } from 'libs/datasource/prisma.service';
import { AlertRule, AlertContact, AlertLog } from '@prisma/client';

@Injectable()
export class AlertService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRule(addRuleDto: AddRuleDto): Promise<AlertRule> {
    return await this.prismaService.alertRule.create({
      data: {
        name: addRuleDto.name,
        filter: addRuleDto.filter,
        thresholdsTime: addRuleDto.thresholdsTime,
        thresholdsOperator: addRuleDto.thresholdsOperator,
        thresholdsQuota: addRuleDto.thresholdsQuota,
        silence: addRuleDto.silence,
        project: {
          connect: { id: addRuleDto.projectId },
        },
      },
    });
  }

  async updateRule(updateRuleDto: UpdateRuleDto): Promise<AlertRule> {
    return await this.prismaService.alertRule.update({
      where: {
        id: updateRuleDto.id,
      },
      data: {
        name: updateRuleDto.name,
        filter: updateRuleDto.filter,
        thresholdsTime: updateRuleDto.thresholdsTime,
        thresholdsOperator: updateRuleDto.thresholdsOperator,
        thresholdsQuota: updateRuleDto.thresholdsQuota,
        silence: updateRuleDto.silence,
        project: {
          connect: { id: updateRuleDto.projectId },
        },
      },
    });
  }

  async deleteRule(ruleId: number): Promise<AlertRule> {
    return await this.prismaService.alertRule.delete({ where: { id: ruleId } });
  }

  async queryRule(projectId: number): Promise<AlertRule[]> {
    return await this.prismaService.alertRule.findMany({
      where: {
        project: {
          id: projectId,
        },
      },
      include: {
        alert_contact: {
          include: {
            user: true,
          },
        },
        alert_log: true,
      },
    });
  }

  async toggleRule(ruleId: number, open: boolean): Promise<AlertRule> {
    return await this.prismaService.alertRule.update({
      where: { id: ruleId },
      data: { open: Number(open) },
    });
  }

  async addRuleContact(ruleId: number, userId: number): Promise<AlertContact> {
    return await this.prismaService.alertContact.create({
      data: {
        alert_rule: {
          connect: { id: ruleId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
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
    return this.prismaService.alertContact.findMany({
      where: {
        alert_rule: {
          id: ruleId,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async removeRuleContact(contactId: number): Promise<AlertContact> {
    return await this.prismaService.alertContact.delete({
      where: {
        id: contactId,
      },
    });
  }

  async createAlertLog(
    ruleId: number,
    projectId: number,
    content: string,
  ): Promise<AlertLog> {
    return await this.prismaService.alertLog.create({
      data: {
        content,
        project: {
          connect: { id: projectId },
        },
        alert_rule: {
          connect: { id: ruleId },
        },
      },
    });
  }

  async queryAlertLogs(
    projectId: number,
    from: number,
    to: number,
  ): Promise<AlertLog[]> {
    return await this.prismaService.alertLog.findMany({
      where: {
        projectId,
        createdAt: {
          gte: new Date(+from),
          lt: new Date(+to),
        },
      },
      include: {
        alert_rule: true,
      },
    });
  }
}

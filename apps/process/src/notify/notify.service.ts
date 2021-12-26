import { Inject, Injectable, Logger, CACHE_MANAGER } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { AlertService } from 'apps/manager/src/alert/alert.service';
import { ProjectService } from 'apps/manager/src/project/project.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticIndexOfError } from 'libs/shared/constant';
import { MailService } from 'apps/manager/src/common/service/mail.service';
import { ConfigService } from '@nestjs/config';
import { dateNow } from 'libs/shared';
import { Project, AlertRule } from '@prisma/client';

@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly alertService: AlertService,
    private readonly projectService: ProjectService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly mailService: MailService,
  ) {}

  async elasticQueryCount(eql): Promise<number> {
    const body = { query: { bool: { filter: eql } } };
    const result = await this.elasticsearchService.count({
      index: ElasticIndexOfError,
      body,
    });
    return result.body.count;
  }

  // 告警逻辑
  async handleErrorEvent(data: any) {
    const appKey = data?.appKey;
    if (!appKey) return;

    const project = await this.projectService.findByAppKey(appKey);
    if (!project) {
      this.logger.debug(`未查询到项目 appKey：${appKey}`);
      return null;
    }
    const rules = await this.alertService.queryRule(project.id);
    if (!rules || rules.length <= 0) return;

    const alertResults = await this.rulesCheck(project, rules);
    if (!alertResults || alertResults.length <= 0) return;

    for await (const result of alertResults) {
      await this.notifyToContacts(
        project,
        result.rule,
        result.actualValue,
        data?.fingerprint,
      );
    }
  }

  async rulesCheck(project: Project, rules: AlertRule[]) {
    const rulesNeedAlert: { actualValue: number; rule: AlertRule }[] = [];

    for await (const rule of rules) {
      if (!rule.open) return;
      const rFilter = rule.filter as any[];

      // 构建查询体
      const eql = [];
      rFilter.every((item) => {
        const key = item['key'];
        const value = item['value'];
        eql.push({ match: { [key]: value } });
      });
      const now = Date.now();
      const from = now - rule.thresholdsTime * 1000;
      eql.push({ range: { timestamp: { gte: from, lte: now } } });

      // 查询
      const actualValue = await this.elasticQueryCount(eql);

      // 是否满足条件
      let isTrigger = false;
      if (rule.thresholdsOperator === '>') {
        isTrigger = actualValue > rule.thresholdsQuota;
      }
      if (rule.thresholdsOperator === '<') {
        isTrigger = actualValue < rule.thresholdsQuota;
      }

      if (isTrigger) {
        rulesNeedAlert.push({ actualValue, rule: rule });
      }
    }

    return rulesNeedAlert;
  }

  async notifyToContacts(
    project: Project,
    rule: AlertRule,
    actualValue: number,
    fingerprint: string,
  ) {
    const { name, id: projectId, appKey } = project;
    const {
      id: ruleId,
      name: ruleName,
      thresholdsTime,
      thresholdsOperator,
      thresholdsQuota,
      silence,
    } = rule;

    const doraUrl = this.configService.get<string>('dora_url');
    const title = `【Dora告警-${ruleName}】项目：${name} ${dateNow()} `;
    const message = `在${thresholdsTime}秒内发生了${actualValue}次，${thresholdsOperator}${thresholdsQuota}次`;
    const link = `${doraUrl}/projects/${appKey}/console/issues/${fingerprint}?from=email`;

    // 检查是否静默期
    const silenceCacheKey = `rule-${ruleId}-silence`;
    const isInSilentPeriod = await this.cacheManager.get(silenceCacheKey);
    if (isInSilentPeriod) return;

    // 挨个通知
    const contacts = await this.alertService.getRuleContacts(ruleId);
    if (!contacts || contacts.length <= 0) return;

    for await (const contact of contacts) {
      // email
      if (contact.type === 'user') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const email = contact?.user?.email;
        if (email) {
          await this.sendMailToUser(email, title, message, link);
          await this.alertService.createAlertLog(ruleId, projectId, message);
          this.logger.log(`邮件告警：${title + message}`);
        }
      }
      // 钉钉
      if (contact.type === 'ding') {
        await this.sendMsgToDingDingBot();
        await this.alertService.createAlertLog(ruleId, projectId, message);
        this.logger.log(`钉钉告警：${title + message}`);
      }
    }

    // 静默期 标记已通知
    await this.cacheManager.set(silenceCacheKey, true, {
      ttl: silence * 60,
    });
  }

  async sendMailToUser(to, subject, text, link): Promise<void> {
    await this.mailService.sendEmail({
      from: '',
      to,
      subject,
      text,
      html: `<b>${text}</b><br/><a href="${link}">点击前往查看</a>`,
    });
  }

  async sendMsgToDingDingBot(): Promise<void> {
    return;
  }
}

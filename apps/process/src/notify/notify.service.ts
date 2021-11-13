import { Inject, Injectable, Logger, CACHE_MANAGER } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { AlertService } from 'apps/manager/src/alert/alert.service';
import { ProjectService } from 'apps/manager/src/project/project.service';
import { AlertRule, Project } from 'libs/datasource';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticIndexOfError } from 'libs/shared/constant';
import { MailService } from 'apps/manager/src/common/service/mail.service';
import { ConfigService } from '@nestjs/config';
import { dateNow } from 'libs/shared';

@Injectable()
export class NotifyService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly alertService: AlertService,
    private readonly projectService: ProjectService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly mailService: MailService,
  ) {}

  private readonly logger = new Logger(NotifyService.name);

  async elasticQueryCount(eql): Promise<number> {
    const body = {
      query: {
        bool: {
          filter: eql,
        },
      },
    };

    const result = await this.elasticsearchService.count({
      index: ElasticIndexOfError,
      body,
    });

    return result.body.count;
  }

  async queryRules(
    appKey: string,
  ): Promise<{ project: Project; rules: AlertRule[] }> {
    const project = await this.projectService.findByAppKey(appKey);
    if (!project) {
      this.logger.debug(`未查询到项目 appKey：${appKey}`);
      return null;
    }
    const rules = await this.alertService.queryRule(project.id);
    return { project, rules };
  }

  // 告警逻辑
  async handleErrorEvent(data: any) {
    const appKey = data?.appKey;
    if (!appKey) return;
    const result = await this.queryRules(appKey);

    if (result && result.project && Array.isArray(result.rules)) {
      await this.rulesCheck(result.project, result.rules);
    }
  }

  async rulesCheck(project: Project, rules: AlertRule[]): Promise<void> {
    for await (const rule of rules) {
      if (!rule.open) return;
      const rFilter = rule.filter;

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
        await this.notifyToContacts(project, rule, actualValue);
      }
    }
  }

  async notifyToContacts(
    project: Project,
    rule: AlertRule,
    actualValue: number,
  ) {
    const { name, appKey } = project;
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
    const link = `${doraUrl}/console/${appKey}/issues`;

    // 检查是否静默期
    const silenceCacheKey = `rule-${ruleId}-silence`;
    const isInSilentPeriod = await this.cacheManager.get(silenceCacheKey);
    if (isInSilentPeriod) {
      return;
    }

    // 挨个通知
    const contacts = await this.alertService.getRuleContacts(ruleId);
    if (Array.isArray(contacts)) {
      for await (const contact of contacts) {
        // email
        if (contact.type === 'user') {
          const email = contact.user.email;
          if (email) {
            await this.sendMailToUser(email, title, message, link);
            this.logger.log(`邮件告警：${title + message}`);
          }
        }
        // 钉钉
        if (contact.type === 'ding') {
          await this.sendMsgToDingDingBot();
          this.logger.log(`钉钉告警：${title + message}`);
        }
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

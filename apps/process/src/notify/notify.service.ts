import { Injectable, Logger } from '@nestjs/common';
import { AlertService } from 'apps/manager/src/alert/alert.service';
import { ProjectService } from 'apps/manager/src/project/project.service';
import { AlertRule, Project } from 'libs/datasource';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticIndexOfError } from 'libs/shared/constant';

@Injectable()
export class NotifyService {
  constructor(
    private readonly alertService: AlertService,
    private readonly projectService: ProjectService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  private readonly logger = new Logger(NotifyService.name);

  async checkProjectAlertRules(data: any) {
    const appKey = data?.appKey;
    if (appKey) {
      const { project, rules } = await this.getProjectRules(appKey);
      await this.isTriggerProjectRules(project, rules);
    }
  }

  // 缓存
  async getProjectRules(
    appKey: string,
  ): Promise<{ project: Project; rules: AlertRule[] }> {
    const project = await this.projectService.findByAppKey(appKey);
    const rules = await this.alertService.queryRule(project.id);
    return { project, rules };
  }

  async isTriggerProjectRules(
    project: Project,
    rules: AlertRule[],
  ): Promise<void> {
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
      const resultCount = await this.elasticsearchQueryCount(eql);

      // 是否满足条件
      let isTrigger = false;
      if (rule.thresholdsOperator === '>') {
        isTrigger = resultCount > rule.thresholdsQuota;
      }
      if (rule.thresholdsOperator === '<') {
        isTrigger = resultCount < rule.thresholdsQuota;
      }

      const prefix = `【项目: ${project.name} - 报警规则: ${rule.name}】`;
      const alertMessage = `${prefix}，发生数：${resultCount}，满足 ${rule.thresholdsTime}秒内 ${rule.thresholdsOperator} ${rule.thresholdsQuota}次`;

      if (isTrigger) {
        this.logger.warn(alertMessage);
        // 静默期
      } else {
        this.logger.debug(`${prefix}，没有触发！！ resultCount:${resultCount}`);
      }
    }
  }

  async elasticsearchQueryCount(eql): Promise<number> {
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

  async notificationToUser(): Promise<string> {
    return '';
  }
}

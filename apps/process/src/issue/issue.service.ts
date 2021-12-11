import * as lodash from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'libs/datasource/prisma.service';
import { Issue } from '@prisma/client';

@Injectable()
export class IssueService {
  constructor(private readonly prismaService: PrismaService) {}

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

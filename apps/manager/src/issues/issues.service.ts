import { Injectable } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { PrismaService } from 'libs/datasource/prisma.service';
import { PaginationRes } from '../common/responseDto';

@Injectable()
export class IssuesService {
  constructor(private readonly prismaService: PrismaService) {}

  async list(
    params: { page: number; limit: number } & {
      appKey: string;
      release: string;
      environment: string;
      from: number;
      to: number;
    },
  ): Promise<PaginationRes<Issue>> {
    const { page, limit } = params;
    const { appKey, release, environment, from, to } = params;
    const cond: any = {
      appKey: appKey,
      recently: {
        gte: new Date(+from),
        lt: new Date(+to),
      },
    };
    if (environment) cond.environment = environment;
    if (release) cond.release = release;

    const total = await this.prismaService.issue.count({
      where: cond,
    });
    const list = await this.prismaService.issue.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: cond,
      orderBy: {
        recently: 'desc',
      },
    });

    return {
      items: list,
      page: page,
      limit: limit,
      total,
    };
  }
}

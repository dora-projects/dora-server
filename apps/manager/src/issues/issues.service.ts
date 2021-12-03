import { Injectable } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { PrismaService } from 'libs/datasource/prisma.service';

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
  ): Promise<Issue[]> {
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
    if (release) cond.environment = environment;

    return this.prismaService.issue.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: cond,
      orderBy: {
        recently: 'desc',
      },
    });
  }
}

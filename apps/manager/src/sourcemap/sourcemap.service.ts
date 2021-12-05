import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/datasource';

@Injectable()
export class SourcemapService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(release: string, path: string, projectId: number) {
    return await this.prismaService.sourcemap.create({
      data: {
        release: release,
        path: path,
        project: {
          connect: { id: projectId },
        },
      },
    });
  }
}

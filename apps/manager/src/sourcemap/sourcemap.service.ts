import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/datasource';

@Injectable()
export class SourcemapService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: {
    release: string;
    path: string;
    compressedPath: string;
    projectId: number;
  }) {
    const { release, compressedPath, path, projectId } = data;
    return await this.prismaService.sourcemap.create({
      data: {
        release: release,
        path: path,
        compressedPath: compressedPath,
        project: {
          connect: { id: projectId },
        },
      },
    });
  }
}

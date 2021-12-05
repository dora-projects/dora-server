import { resolve } from 'path';
import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import * as uuid from 'uuid';
import * as fsx from 'fs-extra';
import { SourcemapService } from '../sourcemap/sourcemap.service';
import * as extract from 'extract-zip';
import { ProjectService } from '../project/project.service';

const cwd = process.cwd();

@Injectable()
export class FileService {
  constructor(
    private readonly sourcemapService: SourcemapService,
    private readonly projectService: ProjectService,
  ) {}

  async handleUploadType(body: any, file: Express.Multer.File): Promise<void> {
    switch (body?.type) {
      case 'sourcemap':
        const sourceDir = resolve(cwd, `uploads/${file.filename}`);
        const dist = `uploads/unzip/${uuid.v4()}`;
        const distDir = resolve(cwd, dist);
        fsx.ensureDir(distDir);

        // 解压
        await this.unArchiverFile(sourceDir, distDir);

        // 保存记录
        const project = await this.projectService.findByAppKey(body?.appKey);
        if (!project?.id) {
          throw new Error(
            `can\`t find project info by appKey: ${body?.appKey}`,
          );
        }

        await this.sourcemapService.create(body?.release, dist, project?.id);
        return;
      case 'artifact':
        console.log('---------upload-artifact-------------');

        return;
      default:
        return;
    }
  }

  async unArchiverFile(source: string, target: string) {
    return await extract(source, { dir: target });
  }
}

import { resolve } from 'path';
import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import * as uuid from 'uuid';
import * as fsx from 'fs-extra';
import { SourcemapService } from '../sourcemap/sourcemap.service';
import * as extract from 'extract-zip';
import { ProjectService } from '../project/project.service';
import { ArtifactService } from '../artifact/artifact.service';

const cwd = process.cwd();

@Injectable()
export class FileService {
  constructor(
    private readonly sourcemapService: SourcemapService,
    private readonly artifactService: ArtifactService,
    private readonly projectService: ProjectService,
  ) {}

  async handleUploadType(body: any, file: Express.Multer.File): Promise<void> {
    const sourceDir = `uploads/${file.filename}`;
    const absSourceDir = resolve(cwd, sourceDir);
    const project = await this.projectService.findByAppKey(body?.appKey);
    if (!project?.id) {
      throw new Error(`can\`t find project info by appKey: ${body?.appKey}`);
    }

    switch (body?.type) {
      case 'sourcemap':
        const unzipDist = `uploads/unzip/${uuid.v4()}`;
        const absDistDir = resolve(cwd, unzipDist);
        fsx.ensureDir(absDistDir);

        await this.unArchiverFile(absSourceDir, absDistDir);
        await this.sourcemapService.create(
          body?.release,
          unzipDist,
          project?.id,
        );
        break;

      case 'artifact':
        await this.artifactService.create(
          body?.release,
          sourceDir,
          project?.id,
        );
        break;

      default:
        break;
    }
  }

  async unArchiverFile(source: string, target: string) {
    return await extract(source, { dir: target });
  }
}

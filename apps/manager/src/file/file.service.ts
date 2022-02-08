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
    console.log(body);

    const sourceDir = `uploads/${file.filename}`;
    const absSourceDir = resolve(cwd, sourceDir);
    const project = await this.projectService.findByAppKey(body?.appKey);
    if (!project?.id) {
      throw new Error(`can\`t find project info by appKey: ${body?.appKey}`);
    }

    const unzipDist = `uploads/unzip/${uuid.v4()}`;
    const absDistDir = resolve(cwd, unzipDist);
    fsx.ensureDir(absDistDir);

    await this.unArchiverFile(absSourceDir, absDistDir);

    switch (body?.type) {
      case 'sourcemap':
        await this.sourcemapService.create({
          projectId: project?.id,
          path: unzipDist,
          compressedPath: sourceDir,
          release: body.release,
        });
        break;

      case 'artifact':
        await this.artifactService.create({
          path: unzipDist,
          compressedPath: sourceDir,

          release: body.release,
          author: body.author,
          authorMail: body.author_mail,
          gitBranch: body.git_branch,
          commit: body.commit,
          commitHash: body.commit_hash,
          commitAt: body.commit_at,

          projectId: project?.id,
        });
        break;

      default:
        break;
    }
  }

  async unArchiverFile(source: string, target: string) {
    return await extract(source, { dir: target });
  }
}

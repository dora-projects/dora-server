import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { SourcemapService } from '../sourcemap/sourcemap.service';
import { ProjectService } from '../project/project.service';
import { MyCacheModule, PrismaService } from 'libs/datasource';
import { ArtifactService } from '../artifact/artifact.service';

@Module({
  imports: [MyCacheModule],
  controllers: [FileController],
  providers: [
    FileService,
    ArtifactService,
    PrismaService,
    SourcemapService,
    ProjectService,
  ],
})
export class FileModule {}

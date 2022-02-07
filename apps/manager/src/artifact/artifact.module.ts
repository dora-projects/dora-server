import { Module } from '@nestjs/common';
import { ArtifactController } from './artifact.controller';
import { ArtifactService } from './artifact.service';
import { PrismaService } from 'libs/datasource';
import { ProjectService } from '../project/project.service';

@Module({
  controllers: [ArtifactController],
  providers: [ArtifactService, ProjectService, PrismaService],
})
export class ArtifactModule {}

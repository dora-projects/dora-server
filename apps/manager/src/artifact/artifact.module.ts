import { Module } from '@nestjs/common';
import { ArtifactController } from './artifact.controller';
import { ArtifactService } from './artifact.service';
import { MyCacheModule, PrismaService } from 'libs/datasource';
import { ProjectService } from '../project/project.service';

@Module({
  imports: [MyCacheModule],
  controllers: [ArtifactController],
  providers: [ArtifactService, ProjectService, PrismaService],
})
export class ArtifactModule {}

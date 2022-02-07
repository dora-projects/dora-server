import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { DeleteDto } from './artifact.dto';
import { ArtifactService } from './artifact.service';
import { PaginationRes } from '../common/responseDto';
import { Artifact } from '@prisma/client';
import { ProjectService } from '../project/project.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('artifact')
@Controller()
export class ArtifactController {
  constructor(
    private readonly artifactService: ArtifactService,
    private readonly projectService: ProjectService,
  ) {}

  @Get('manager/artifacts')
  async queryArtifacts(
    @Query('appKey') appKey,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
  ): Promise<PaginationRes<Artifact>> {
    const project = await this.projectService.findByAppKey(appKey);
    if (!project) throw new Error(`cant\`t find project by appKey:${appKey}`);

    const projectId = project.id;
    return this.artifactService.list({ projectId, page, limit });
  }

  @Delete('manager/artifact')
  deleteArtifact(@Query() query: DeleteDto): any {
    return query;
  }
}

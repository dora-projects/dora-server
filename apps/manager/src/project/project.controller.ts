import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './project.dto';
import { AlertRule, Project } from 'libs/datasource';

@ApiTags('project')
@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Put('api/project')
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project | void> {
    return await this.projectService.create(createProjectDto);
  }

  @Get('api/project')
  @ApiQuery({ name: 'id', type: 'number', required: false })
  @ApiQuery({ name: 'appKey', type: 'string', required: false })
  async projectInfo(@Query() query): Promise<Project | undefined> {
    const { id, appKey } = query;
    if (id) {
      return this.projectService.findById(id);
    }
    if (appKey) {
      return this.projectService.findByAppKey(appKey);
    }
  }

  @Delete('api/project/:id')
  @ApiParam({ name: 'id' })
  async deleteProject(@Param('id') id: number): Promise<void> {
    return await this.projectService.delete(id);
  }
}

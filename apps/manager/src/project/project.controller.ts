import { Controller, Get } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('project')
@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('api/projects')
  getHello(): string {
    return this.projectService.getHello();
  }
}

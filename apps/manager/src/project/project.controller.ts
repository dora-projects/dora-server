import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Request,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateProjectDto,
  JoinProjectDto,
  UpdateProjectDto,
} from './project.dto';
import { Project, User } from 'libs/datasource';
import { ErrorRes, SuccessOrErrorRes, SuccessRes } from '../common/responseDto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateResult } from 'typeorm';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('project')
@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Put('api/project')
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
  ): Promise<Project | void> {
    const userId = req.user?.result?.id;
    return await this.projectService.create(createProjectDto, userId);
  }

  @Post('api/project')
  async updateProject(
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<UpdateResult | void> {
    return await this.projectService.update(updateProjectDto);
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

  @Get('api/my/projects')
  async projectList(@Request() req): Promise<Project[]> {
    const userId = req.user?.result?.id;
    return await this.projectService.findUserProjects(userId);
  }

  @Get('api/project/users')
  async projectUsers(@Query('projectId') projectId: number): Promise<User[]> {
    return await this.projectService.findProjectUsers(projectId);
  }

  @ApiOkResponse({ type: SuccessRes })
  @ApiInternalServerErrorResponse({ type: ErrorRes })
  @Post('api/project/addUsers')
  async joinProject(
    @Body() joinProjectDto: JoinProjectDto,
  ): Promise<SuccessOrErrorRes> {
    const { projectId, userIds } = joinProjectDto;
    await this.projectService.projectAddUser(projectId, userIds);
    return { success: true };
  }

  @ApiOkResponse({ type: SuccessRes })
  @Post('api/project/removeUsers')
  async leaveProject(
    @Body() joinProjectDto: JoinProjectDto,
  ): Promise<SuccessRes> {
    const { projectId, userIds } = joinProjectDto;
    await this.projectService.projectRemoveUser(projectId, userIds);
    return { success: true };
  }
}

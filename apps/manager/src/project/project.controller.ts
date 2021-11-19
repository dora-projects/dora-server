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
  BadRequestException,
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
  LeaveProjectDto,
  UpdateProjectDto,
} from './project.dto';
import { Project, ProjectRoleEnum, User } from 'libs/datasource';
import { ErrorRes, SuccessOrErrorRes, SuccessRes } from '../common/responseDto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateResult } from 'typeorm';
import { UnauthorizedOperation } from '../common/error';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('project')
@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Put('manager/project')
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
  ): Promise<Project | void> {
    const userId = req.user?.id;
    return await this.projectService.create(createProjectDto, userId);
  }

  @Post('manager/project')
  async updateProject(
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<UpdateResult | void> {
    return await this.projectService.update(updateProjectDto);
  }

  @Get('manager/project')
  @ApiQuery({ name: 'id', type: 'number', required: false })
  @ApiQuery({ name: 'appKey', type: 'string', required: false })
  async projectInfo(
    @Request() req,
    @Query() query,
  ): Promise<Project | undefined> {
    const userId = req.user?.id;
    const { id, appKey } = query;

    let project: Project;
    if (id) project = await this.projectService.findById(id);
    if (appKey) project = await this.projectService.findByAppKey(appKey);

    if (!project) {
      throw new BadRequestException('项目不存在');
    }

    const canAccess = await this.projectService.isUserCanAccessProject(
      project.appKey,
      userId,
    );
    if (!canAccess) throw new UnauthorizedOperation('无权限访问该项目');

    return project;
  }

  @Delete('manager/project/:id')
  @ApiParam({ name: 'id' })
  async deleteProject(
    @Request() req,
    @Param('id') projectId: number,
  ): Promise<{ success: boolean }> {
    const loginUserId = req.user?.id;
    await this.projectService.requireProjectRole(
      loginUserId,
      projectId,
      ProjectRoleEnum.Owner,
    );

    await this.projectService.delete(projectId);
    return { success: true };
  }

  @Get('manager/my/projects')
  async projectList(@Request() req): Promise<Project[]> {
    const userId = req.user?.id;
    return await this.projectService.findUserProjects(userId);
  }

  @Get('manager/project/users')
  async projectUsers(@Query('projectId') projectId: number): Promise<User[]> {
    return await this.projectService.findProjectUsers(projectId);
  }

  @ApiOkResponse({ type: SuccessRes })
  @ApiInternalServerErrorResponse({ type: ErrorRes })
  @Post('manager/project/addUsers')
  async joinProject(
    @Request() req,
    @Body() joinProjectDto: JoinProjectDto,
  ): Promise<SuccessOrErrorRes> {
    const { projectId, userIds } = joinProjectDto;

    // const loginUserId = req.user?.id;
    // await this.projectService.requireProjectRole(
    //   loginUserId,
    //   projectId,
    //   ProjectRoleEnum.Owner,
    // );
    await this.projectService.projectAddUsers(projectId, userIds);
    return { success: true };
  }

  @ApiOkResponse({ type: SuccessRes })
  @Post('manager/project/removeUsers')
  async leaveProject(
    @Request() req,
    @Body() leaveProjectDto: LeaveProjectDto,
  ): Promise<SuccessRes> {
    const { projectId, userId } = leaveProjectDto;

    const loginUserId = req.user?.id;
    await this.projectService.requireProjectRole(
      loginUserId,
      projectId,
      ProjectRoleEnum.Owner,
    );

    await this.projectService.projectRemoveUser(projectId, userId);
    return { success: true };
  }
}

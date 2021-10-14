import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Query,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { TeamService } from './team.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Project, Team, User } from 'libs/datasource';
import {
  CreateTeamDto,
  JoinTeamDto,
  TeamProjectDto,
  UpdateTeamDto,
} from './team.dto';
import { ErrorRes, SuccessOrErrorRes, SuccessRes } from '../common/responseDto';
import { UpdateResult } from 'typeorm';

@ApiTags('team')
@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('api/teams')
  getTeams(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
  ): Promise<Pagination<Team>> {
    return this.teamService.paginate({
      page,
      limit,
    });
  }

  @Get('api/team/users')
  async teamUsers(@Query('teamId') teamId: number): Promise<User[]> {
    return await this.teamService.teamUsers(teamId);
  }

  @Put('api/team')
  async createTeam(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return await this.teamService.create(createTeamDto);
  }

  @Post('api/team/update')
  async updateTeam(@Body() dto: UpdateTeamDto): Promise<UpdateResult> {
    return await this.teamService.update(dto);
  }

  @ApiOkResponse({ type: SuccessRes })
  @ApiInternalServerErrorResponse({ type: ErrorRes })
  @Post('api/team/join')
  async joinTeam(@Body() joinTeamDto: JoinTeamDto): Promise<SuccessOrErrorRes> {
    const { teamId, userId } = joinTeamDto;
    try {
      await this.teamService.joinTeam(teamId, userId);
    } catch (e) {
      return {
        error: e.detail,
      };
    }
    return { success: true };
  }

  @ApiOkResponse({ type: SuccessRes })
  @Post('api/team/leave')
  async leaveTeam(@Body() joinTeamDto: JoinTeamDto): Promise<SuccessRes> {
    const { teamId, userId } = joinTeamDto;
    await this.teamService.leaveTeam(teamId, userId);
    return { success: true };
  }

  @Get('api/team/projects')
  async getTeamProjects(@Query('teamId') teamId: number): Promise<Project[]> {
    return await this.teamService.getTeamProjects(teamId);
  }

  @Post('api/team/project/add')
  async addTeamProject(
    @Body() teamProjectDto: TeamProjectDto,
  ): Promise<SuccessRes> {
    const { teamId, projectId } = teamProjectDto;
    await this.teamService.addTeamProjects(teamId, projectId);
    return { success: true };
  }

  @Post('api/team/project/remove')
  async removeTeamProject(
    @Body() teamProjectDto: TeamProjectDto,
  ): Promise<SuccessRes> {
    const { teamId, projectId } = teamProjectDto;
    await this.teamService.removeTeamProjects(teamId, projectId);
    return { success: true };
  }

  @Delete('api/team/:id')
  @ApiParam({ name: 'id' })
  async deleteTeam(@Param() teamId: number): Promise<SuccessRes> {
    await this.teamService.delete(teamId);
    return {
      success: true,
    };
  }
}

import {
  Body,
  Controller,
  DefaultValuePipe,
  ParseIntPipe,
  Post,
  Get,
  Delete,
  Query,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';
import { ApiQuery, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { UserService } from './user.service';
import { Project, User, UserDashboard } from 'libs/datasource';
import { CreateUserDto, UpdateDashboardDto } from './user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @Put('api/user')
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  @ApiBody({ type: CreateUserDto })
  @Post('api/user/update')
  async updateUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  @Get('api/search/users')
  @ApiQuery({ name: 'searchStr', type: 'string', required: false })
  searchUsers(@Query() query): Promise<User[]> {
    const { searchStr } = query;
    return this.userService.searchUser(searchStr);
  }

  @Get('api/users')
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate({ page, limit });
  }

  @Delete('api/user')
  @ApiQuery({ name: 'id', required: false })
  async delUser(@Query('id') id: string): Promise<void> {
    return await this.userService.remove(id);
  }

  @Get('api/dashboard')
  async getDashboardProject(@Request() req): Promise<Project> {
    const userId = req.user?.result?.id;
    return await this.userService.getDashboardSetting(userId);
  }

  @Post('api/dashboard')
  async UpdateDashboardProject(
    @Request() req,
    @Body() updateDashboardDto: UpdateDashboardDto,
  ): Promise<UpdateResult | InsertResult> {
    const { projectId } = updateDashboardDto;
    const userId = req.user?.result?.id;

    return await this.userService.updateDashboardSetting(userId, projectId);
  }
}

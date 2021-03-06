import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserConfigDto } from './user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { PaginationRes, SuccessRes } from '../common/responseDto';
import { User, UserConfig, USER_ROLE } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @Put('manager/user')
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  @ApiBody({ type: UpdateUserDto })
  @Post('manager/user/update')
  async updateUser(@Body() user: UpdateUserDto): Promise<SuccessRes> {
    await this.userService.update(user);
    return { success: true };
  }

  @Get('manager/user/config')
  async queryUserConfig(@Req() req): Promise<UserConfig> {
    const userId = req.user?.id;
    return this.userService.getUserConfig(userId);
  }

  @Post('manager/user/config')
  async updateUserConfig(
    @Req() req,
    @Body() userConfig: UserConfigDto,
  ): Promise<UserConfig> {
    const userId = req.user?.id;
    const projectId = userConfig?.projectId;
    return this.userService.updateUserConfig(userId, projectId);
  }

  @Get('manager/search/users')
  @ApiQuery({ name: 'searchStr', type: 'string', required: false })
  searchUsers(@Query() query): Promise<User[]> {
    const { searchStr } = query;
    return this.userService.searchUser(searchStr);
  }

  @Get('manager/users')
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
  ): Promise<PaginationRes<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.userList({ page, limit });
  }

  @Roles(USER_ROLE.admin)
  @Delete('manager/user')
  @ApiQuery({ name: 'id', required: false })
  async delUser(@Query('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.deleteUser(id);
  }

  // @Get('manager/user/setting')
  // async getSetting(@Request() req): Promise<Setting> {
  //   const userId = req.user?.id;
  //   return await this.userService.getSettingOrDefault(userId);
  // }
  //
  // @Post('manager/user/setting')
  // async UpdateSetting(
  //   @Request() req,
  //   @Body() updateDefaultDto: UpdateDefaultDashboardDto,
  // ): Promise<UpdateResult | InsertResult> {
  //   const { projectId } = updateDefaultDto;
  //   const userId = req.user?.id;
  //   return await this.userService.updateSetting(userId, projectId);
  // }
}

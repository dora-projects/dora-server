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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { UserService } from './user.service';
import { Role, User } from 'libs/datasource';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { SuccessRes } from '../common/responseDto';

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
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate({ page, limit });
  }

  @Roles(Role.Admin)
  @Delete('manager/user')
  @ApiQuery({ name: 'id', required: false })
  async delUser(@Query('id') id: string): Promise<void> {
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

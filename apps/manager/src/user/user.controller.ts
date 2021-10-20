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
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiQuery, ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from 'libs/datasource';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateUserDto } from './user.dto';

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
}

import {
  Body,
  Controller,
  DefaultValuePipe,
  ParseIntPipe,
  Post,
  Get,
  Delete,
  Query,
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
  @Post('api/user/create')
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  @ApiBody({ type: CreateUserDto })
  @Post('api/user/update')
  async updateUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  @Get('api/users')
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate({ page, limit });
  }

  @Get('api/user')
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'username', required: false })
  async queryUser(@Query() query): Promise<{
    result: User[] | User;
  }> {
    const { id, email, username } = query;
    if (id) {
      return { result: await this.userService.findOne(id) };
    }
    if (email) {
      return { result: await this.userService.findByEmail(id) };
    }
    if (username) {
      return { result: await this.userService.searchByUsername(username) };
    }
  }

  @Delete('api/user')
  @ApiQuery({ name: 'id', required: false })
  async delUser(@Query('id') id: string): Promise<void> {
    return await this.userService.remove(id);
  }
}

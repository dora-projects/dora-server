import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LoginDto, RegisterUserDto } from './auth.dto';
import { sleep } from 'libs/shared';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('api/auth/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('api/auth/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    await this.authService.register(registerUserDto);
    return await this.authService.login({
      email: registerUserDto.email,
      password: registerUserDto.password,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/auth/me')
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    await sleep(600);
    return req.user;
  }
}

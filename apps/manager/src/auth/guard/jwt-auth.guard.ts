import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (info?.message === 'No auth token') {
      throw new UnauthorizedException('未登录');
    }

    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException('登录失效');
    }

    return user;
  }
}

import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // https://github.com/mikenicholson/passport-jwt#extracting-the-jwt-from-the-request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const email = payload?.result?.email;
    const user = await this.authService.findUserAndUpdateLastLogin(email);
    if (!user) {
      throw new UnauthorizedException('登录失效');
    }
    return user;
  }
}

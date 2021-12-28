import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedOperation } from '../../common/error';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super({
      // 配置 Missing credentials
      // https://github.com/jaredhanson/passport-local/blob/0aefeb66e56c790b34a674682d4e6d8a5e9d0a05/lib/strategy.js?_pjax=%23js-repo-pjax-container%2C%20div%5Bitemtype%3D%22http%3A%2F%2Fschema.org%2FSoftwareSourceCode%22%5D%20main%2C%20%5Bdata-pjax-container%5D#L75
      badRequestMessage: 'Missing email or password field',
    });
  }

  // 覆盖
  // https://github.com/nestjs/passport/blob/2760e42510ceef2a01706594896f862147b548bf/lib/auth.guard.ts?_pjax=%23js-repo-pjax-container%2C%20div%5Bitemtype%3D%22http%3A%2F%2Fschema.org%2FSoftwareSourceCode%22%5D%20main%2C%20%5Bdata-pjax-container%5D#L81
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedOperation(info || '未授权');
    }
    return user;
  }
}

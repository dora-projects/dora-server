import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  // 服务错误
  ServerError = 'ServerError',
  // 参数错误
  UnknownParameter = 'UnknownParameter',
  // 参数错误
  InvalidParameter = 'InvalidParameter',
  // 参数值错误
  InvalidParameterValue = 'InvalidParameterValue',
  // 请求超限
  RequestLimitExceeded = 'RequestLimitExceeded',
  // 资源
  ResourceNotFound = 'ResourceNotFound',
  // 不支持的操作
  UnsupportedOperation = 'UnsupportedOperation',
  // 权限不足
  UnauthorizedOperation = 'UnauthorizedOperation',
}

export class CustomException extends HttpException {
  constructor(code: string, message: string) {
    super({ error: { code, message } }, HttpStatus.BAD_REQUEST);
  }
}

export class BadRequestException extends HttpException {
  constructor(msg?: string) {
    super(
      { error: { code: 'BadRequest', message: msg || '请求参数异常' } },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class RecordExistException extends HttpException {
  constructor(msg?: string) {
    super(
      { error: { code: 'RECORD_EXIST', message: msg || '记录已存在' } },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class RecordNotExistException extends HttpException {
  constructor(msg?: string) {
    super(
      { error: { code: 'RECORD_EXIST', message: msg || '记录不存在' } },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UnauthorizedOperation extends HttpException {
  constructor(msg?: string) {
    super(
      {
        error: {
          code: ErrorCode.UnauthorizedOperation,
          message: msg || '未授权的操作',
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class UnsupportedOperation extends HttpException {
  constructor(msg?: string) {
    super(
      {
        error: {
          code: ErrorCode.UnsupportedOperation,
          message: msg || '不支持的操作',
        },
      },
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}

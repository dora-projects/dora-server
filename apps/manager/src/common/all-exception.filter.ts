import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ErrorCode } from './error';

interface NestResponse {
  statusCode: number;
  message: string;
  error: string;
}

interface SystemResponse {
  error: {
    code: string;
    message: string;
  };
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const common = {
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    try {
      const errorResponse = exception?.getResponse?.() as NestResponse &
        SystemResponse;

      let error = { code: '', message: '' };

      // http 错误
      if (errorResponse?.statusCode) {
        error.code = errorResponse.statusCode.toString();
        error.message = `${errorResponse.message}`;

        // 有 error 对象
      } else if (errorResponse?.error) {
        error = errorResponse.error;
      } else {
        // 直接抛出的异常
        this.logger.error('服务异常，响应：', exception);
        error = {
          code: ErrorCode.ServerError,
          message: exception?.message || '服务异常',
        };
      }

      // 返回
      response.status(status).json({ error: { ...error, ...common } });
    } catch (e) {
      this.logger.error('系统错误', e);
      response.status(500).json({
        error: { code: ErrorCode.ServerError, message: '系统错误', ...common },
      });
    }
  }
}
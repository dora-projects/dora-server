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

        // 有 error 对象 （自定义 error）
      } else if (errorResponse?.error) {
        error = errorResponse.error;

        // 直接抛出的异常
      } else {
        error = {
          code: ErrorCode.ServerError,
          message: exception?.message || '服务异常',
        };
        this.logger.error(`服务异常，响应：${exception?.stack}`);
      }

      response.status(status).json({ error: { ...error, ...common } });
    } catch (e) {
      this.logger.error('系统错误', e, e?.stack);
      response.status(500).json({
        error: { code: ErrorCode.ServerError, message: '系统错误', ...common },
      });
    }
  }
}

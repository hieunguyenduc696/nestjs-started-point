import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    response.status(status).json({
      ...this.extractMessage(message),
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
  private extractMessage(message: string | any): object {
    if (typeof message === 'string') {
      return { message };
    }
    return { message: message?.message || 'Unknown' };
  }
}

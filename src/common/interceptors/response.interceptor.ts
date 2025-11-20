/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExecutionContext,
  CallHandler,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        data,
        timestamp: new Date().toISOString(),
        path: req.url,
      })),
    );
  }
}

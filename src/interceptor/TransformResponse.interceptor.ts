import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((responseVale) => {
        if (responseVale.data) {
          return {
            status: 'success',
            count: responseVale.data.length,
            totalCount: responseVale.totalCount,
            data: responseVale.data,
          };
        }
        return {
          status: 'success',
          count: responseVale.length,
          data: responseVale,
        };
      }),
    );
  }
}

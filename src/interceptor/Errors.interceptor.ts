import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  ConflictException,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new ConflictException(
              'There is a unique constraint violation',
            );
          } else if (err.code === 'P2025') {
            throw new BadRequestException(err.meta.cause);
          }
        }
        throw err;
      }),
    );
  }
}

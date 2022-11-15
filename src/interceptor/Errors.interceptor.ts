import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  ConflictException,
  CallHandler,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new ConflictException(
              'There is a unique constraint violation, a new user cannot be created with this email',
            );
          }
        }
        throw err;
      }),
    );
  }
}

/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// eslint-disable-next-line prettier/prettier
import { Observable } from 'rxjs';

@Injectable()
export class DateAdderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const now = new Date();
    console.log(now);
    const format = now.toLocaleDateString("es-CO",
      {
        year: 'numeric', month: "2-digit", day: "2-digit"
      })
    const request = context.switchToHttp().getRequest()
    request.now = format

    return next.handle();
  }
}
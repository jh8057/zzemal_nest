import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HttpLogger');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const url = req.url;
    const body = req.body;

    this.logger.log(`HTTP ${method} ${url} - Body: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap((response) => {
        this.logger.log(
          `Response for ${method} ${url} => ${JSON.stringify(response)}`,
        );
      }),
    );
  }
}

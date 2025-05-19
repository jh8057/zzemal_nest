import { Catch, ArgumentsHost, RpcExceptionFilter } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { HttpException } from '@nestjs/common';

@Catch()
export class AllRpcExceptionsFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    let error: any;
    if (typeof exception.getError === 'function') {
      // RpcException 내부에 실제 예외가 들어있는 경우 꺼내기
      error = exception.getError();
    } else {
      error = exception;
    }
    let status = 500;
    let message = 'Internal server error';

    // error가 HttpException 인스턴스면 status와 메시지 가져오기
    if (error instanceof HttpException) {
      status = error.getStatus();
      const response = error.getResponse();
      // response가 string일 수도, object일 수도 있으니 처리
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        message = (response as any).message || JSON.stringify(response);
      }
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = (error as any).message;
    }

    return of({
      statusCode: status,
      message,
    });
  }
}

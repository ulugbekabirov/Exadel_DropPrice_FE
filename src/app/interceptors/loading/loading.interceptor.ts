import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoadingService } from '../../services/loading/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true, request.url);
    return next.handle(request)
      .pipe(
        catchError((error) => {
          this.loadingService.setLoading(false, request.url);
          return error;
        })
      )
      .pipe(
        map<HttpEvent<any>, any>((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.loadingService.setLoading(false, request.url);
          }
          return event;
        })
      );
  }
}

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            console.warn('client error');
            errorMessage = `Error: ${error.error.message}`;
          } else {
            console.warn('server error');
            errorMessage = `Error Code: ${error.status},  Message: ${error.message}`;
            if (error.status === 401) {
              this.authService.logout();
            }
          }
          console.warn(errorMessage);
          return throwError(errorMessage);
        })
      );
  }

}

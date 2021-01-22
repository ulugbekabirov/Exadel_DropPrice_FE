import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TOKEN_HEADER_KEY } from 'src/constants';
import { AuthService } from './auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authService.activeUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    // need add filter by url
    if (isLoggedIn) {
      const clonedReq: HttpRequest<any> = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, currentUser.token)
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }

}

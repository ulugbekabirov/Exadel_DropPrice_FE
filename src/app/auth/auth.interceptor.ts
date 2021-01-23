import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TOKEN_HEADER_KEY } from 'src/constants';
import { AuthService } from './auth.service';
import { AuthInfo } from '../models';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const activeUser: AuthInfo = this.authService.activeUserValue;
    const isLoggedIn = activeUser && activeUser.token;
    if (isLoggedIn) {
      const clonedReq: HttpRequest<any> = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${activeUser.token}`)
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }

}

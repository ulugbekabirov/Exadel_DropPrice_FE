import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthInfo } from '../models';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authUser: AuthInfo = this.authService.authUserValue;
    console.log('authUser', authUser);
    const isLoggedIn = authUser && authUser.token;
    const isApiUrl = req.url.startsWith(environment.webApiUrl);
    if (isLoggedIn && isApiUrl) {
      const clonedReq: HttpRequest<any> = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authUser.token}`)
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }
}

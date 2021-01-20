import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  TOKEN_HEADER_KEY = 'Authorization';

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getSession();
    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set(this.TOKEN_HEADER_KEY, token)
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }

}

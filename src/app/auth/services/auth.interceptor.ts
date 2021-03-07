import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageService } from '../../services/language/language.service';
import { AuthService } from './auth.service';
import { AuthInfo } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  language;
  constructor(
    private authService: AuthService,
    private languageService: LanguageService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authUser: AuthInfo = this.authService.authUserValue;
    this.languageService.select('activeLanguage')
      .subscribe(next => this.language = next);
    const isLoggedIn = authUser && authUser.token;
    const isApiUrl = req.url.startsWith(environment.webApiUrl);
    if (isLoggedIn && isApiUrl) {
      const clonedReq: HttpRequest<any> = req.clone({
        headers: new HttpHeaders()
          .set('Authorization', `Bearer ${authUser.token}`)
          .set('Accept-Language', `${this.language}`)
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }
}

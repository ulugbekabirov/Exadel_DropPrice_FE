import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthUser } from '../models';
import { AuthInfo } from '../models';
import { ApiDataService } from '../services/api-data.service';
import { KEY_AUTH_TOKEN } from '../../constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private activeUserSubject: BehaviorSubject<AuthInfo>;
  public activeUser: Observable<AuthInfo>;

  constructor(
    private restApi: ApiDataService,
  ) {
    this.activeUserSubject = new BehaviorSubject<AuthInfo>(JSON.parse(localStorage.getItem(KEY_AUTH_TOKEN)));
    this.activeUser = this.activeUserSubject.asObservable();
  }

  get activeUserValue(): AuthInfo {
    return this.activeUserSubject.value;
  }

  isAuthorized(): boolean {
    return !!this.activeUser;
  }

  hasRole(role): boolean {
    return this.isAuthorized() && this.activeUserValue.userRole === role;
  }

  private handleAuth(authInfo: AuthInfo): void {
    localStorage.setItem(KEY_AUTH_TOKEN, JSON.stringify(authInfo));
    this.activeUserSubject.next(authInfo);
  }

  login(user: AuthUser): Observable<AuthInfo> {
    return this.restApi.getAuth(user)
      .pipe(
        tap((authInfo: AuthInfo) => this.handleAuth(authInfo))
      );
  }

  logout(): void {
    localStorage.removeItem(KEY_AUTH_TOKEN);
    this.activeUserSubject.next(null);
  }
}

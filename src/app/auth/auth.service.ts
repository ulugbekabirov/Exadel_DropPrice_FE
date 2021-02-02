import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { concatMap, switchMap, tap } from 'rxjs/operators';
import { ActiveUser, AuthUser } from '../models';
import { AuthInfo } from '../models';
import { ApiDataService } from '../services/api-data.service';
import { KEY_AUTH_TOKEN } from '../../constants';
import { UserService } from '../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private activeUserSubject: BehaviorSubject<AuthInfo>;
  public activeUser: Observable<AuthInfo>;

  constructor(
    private restApi: ApiDataService,
    private userService: UserService,
  ) {
    this.activeUserSubject = new BehaviorSubject<AuthInfo>(JSON.parse(localStorage.getItem(KEY_AUTH_TOKEN)));
    this.activeUser = this.activeUserSubject.asObservable();
  }

  get activeUserValue(): AuthInfo {
    return this.activeUserSubject.value;
  }

  private handleAuth(authInfo: AuthInfo): void {
    localStorage.setItem(KEY_AUTH_TOKEN, JSON.stringify(authInfo));
    this.activeUserSubject.next(authInfo);
  }

  login(user: AuthUser): Observable<ActiveUser> {
    return this.restApi.getAuth(user)
      .pipe(
        tap((authInfo: AuthInfo) => this.handleAuth(authInfo)),
        concatMap(
          (token) => {
            return this.userService.getUserInfo();
          }
        )
      );
  }

  logout(): void {
    this.userService.logout();
    localStorage.removeItem(KEY_AUTH_TOKEN);
    this.activeUserSubject.next(null);
  }
}

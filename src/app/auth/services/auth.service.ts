import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { ActiveUser, AuthUser } from '../../models';
import { AuthInfo } from '../../models';
import { ApiDataService } from '../../services/api-data/api-data.service';
import { KEY_AUTH_TOKEN } from '../../../constants';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUserSubject: BehaviorSubject<AuthInfo>;
  public authUser: Observable<AuthInfo>;

  constructor(
    private restApi: ApiDataService,
    private userService: UserService,
    private router: Router,
  ) {
    this.authUserSubject = new BehaviorSubject<AuthInfo>(JSON.parse(localStorage.getItem(KEY_AUTH_TOKEN)));
    this.authUser = this.authUserSubject.asObservable();
  }

  get authUserValue(): AuthInfo {
    return this.authUserSubject.value;
  }

  private handleAuth(authInfo: AuthInfo): void {
    localStorage.setItem(KEY_AUTH_TOKEN, JSON.stringify(authInfo));
    this.authUserSubject.next(authInfo);
  }

  login(user: AuthUser): Observable<ActiveUser> {
    return this.restApi.getAuth(user)
      .pipe(
        tap((authInfo: AuthInfo) => this.handleAuth(authInfo)),
        concatMap(
          () => {
            return this.userService.getUserInfo();
          }
        )
      );
  }

  logout(): void {
    this.userService.logout();
    localStorage.removeItem(KEY_AUTH_TOKEN);
    this.authUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}

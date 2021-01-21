import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthUser } from '../models';
import { AuthInfoResponse } from '../models';
import { ApiDataService } from '../services/api-data.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  KEY_AUTH_TOKEN = 'key_auth_token';
  private activeUserSubject: BehaviorSubject<AuthInfoResponse>
    = new BehaviorSubject<AuthInfoResponse>(JSON.parse(localStorage.getItem(this.KEY_AUTH_TOKEN)));

  constructor(
    private restApi: ApiDataService,
    private router: Router
  ) {}

  get activeUserValue(): AuthInfoResponse {
    return this.activeUserSubject.value;
  }

  private handleAuth(authInfo: AuthInfoResponse): void {
    localStorage.setItem(this.KEY_AUTH_TOKEN, JSON.stringify(authInfo));
    this.activeUserSubject.next(authInfo);
  }

  login(user: AuthUser): Observable<AuthInfoResponse> {
    return this.restApi.getAuth(user)
      .pipe(
        tap((authInfo: AuthInfoResponse) => this.handleAuth(authInfo))
      );
  }

  logout(): void {
    localStorage.removeItem(this.KEY_AUTH_TOKEN);
    this.activeUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user';
import { UserInfo } from './user-info';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = 'http//localhost:4000';
  KEY_AUTH_TOKEN = 'key_auth_token';
  private activeUserSubject: BehaviorSubject<UserInfo> = new BehaviorSubject<UserInfo>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get activeUserValue(): UserInfo {
    return this.activeUserSubject.value;
  }

  private handleAuth(res: UserInfo): void {
    this.activeUserSubject.next(res);
    localStorage.setItem(this.KEY_AUTH_TOKEN, res.token);
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    console.log('Error', error.message);
    return throwError(error);
  }

  login(user: User): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${this.API_URL}/api/authenticate/login`, user)
      .pipe(
        catchError(this.handleError),
        tap((res: UserInfo) => this.handleAuth(res))
      );
  }

  logout(): void {
    this.activeUserSubject.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem(this.KEY_AUTH_TOKEN);
  }
}

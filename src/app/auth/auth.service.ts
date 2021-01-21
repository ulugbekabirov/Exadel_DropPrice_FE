import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models';
import { AuthInfoResponse } from '../models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = 'http//localhost:4000/api';
  AUTH_ENDPOINT = '/authenticate/login';
  KEY_AUTH_TOKEN = 'key_auth_token';
  private activeUserSubject: BehaviorSubject<AuthInfoResponse>
    = new BehaviorSubject<AuthInfoResponse>(JSON.parse(localStorage.getItem(this.KEY_AUTH_TOKEN)));

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get activeUserValue(): AuthInfoResponse {
    return this.activeUserSubject.value;
  }

  private handleAuth(authInfo: AuthInfoResponse): void {
    localStorage.setItem(this.KEY_AUTH_TOKEN, JSON.stringify(authInfo));
    this.activeUserSubject.next(authInfo);
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error);
  }

  login(user: User): Observable<AuthInfoResponse> {
    return this.http.post<AuthInfoResponse>(`${this.API_URL}${this.AUTH_ENDPOINT}`, user)
      .pipe(
        catchError(this.handleError),
        tap((authInfo: AuthInfoResponse) => this.handleAuth(authInfo))
      );
  }

  logout(): void {
    localStorage.removeItem(this.KEY_AUTH_TOKEN);
    this.activeUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}

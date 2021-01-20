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
  API_URL = 'http//localhost:4000';
  KEY_AUTH_TOKEN = 'key_auth_token';
  private activeUserSubject: BehaviorSubject<AuthInfoResponse> = new BehaviorSubject<AuthInfoResponse>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get activeUserValue(): AuthInfoResponse {
    return this.activeUserSubject.value;
  }

  private handleAuth(res: AuthInfoResponse): void {
    this.activeUserSubject.next(res);
    localStorage.setItem(this.KEY_AUTH_TOKEN, res.token);
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error);
  }

  login(user: User): Observable<AuthInfoResponse> {
    return this.http.post<AuthInfoResponse>(`${this.API_URL}/api/authenticate/login`, user)
      .pipe(
        catchError(this.handleError),
        tap((res: AuthInfoResponse) => this.handleAuth(res))
      );
  }

  logout(): void {
    this.activeUserSubject.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem(this.KEY_AUTH_TOKEN);
  }
}

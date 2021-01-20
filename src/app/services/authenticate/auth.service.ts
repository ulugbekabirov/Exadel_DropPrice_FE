import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = 'http//localhost:4000';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/api/authenticate/login`, {email, password})
      .pipe(
        tap(token => this.setSession(token)),
        shareReplay()
      );
  }
  logout() {
    localStorage.removeItem('key_token');
  }
  getSession() {
    return localStorage.getItem('key_token');
  }
  setSession(token) {
    localStorage.setItem('key_token', token);
  }
}

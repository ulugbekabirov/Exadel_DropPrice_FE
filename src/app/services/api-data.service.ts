import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ActiveUser } from '../models/active-user';
import { AuthInfoResponse, AuthUser } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  API_URL = 'http//localhost:4000/api';
  AUTH_ENDPOINT = '/authenticate/login';
  USER_INFO_ENDPOINT = '/getUserInfo';

  constructor(private http: HttpClient) {}

  handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error);
  }

  getAuth(user: AuthUser): Observable<AuthInfoResponse> {
    return this.http.post<AuthInfoResponse>(`${this.API_URL}${this.AUTH_ENDPOINT}`, user)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getUserInfo(): Observable<ActiveUser> {
    return this.http.get<ActiveUser>(`${this.API_URL}${this.USER_INFO_ENDPOINT}`);
  }

  // getVendors() {}
  // getVendorById() {}
  // getDiscountById() {}

}

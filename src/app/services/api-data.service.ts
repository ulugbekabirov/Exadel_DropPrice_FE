import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ActiveUser } from '../models/active-user';
import { AuthInfoResponse, AuthUser } from '../models';
import { API_URL, AUTH_ENDPOINT, USER_INFO_ENDPOINT } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  constructor(private http: HttpClient) {}

  handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error);
  }

  getAuth(user: AuthUser): Observable<AuthInfoResponse> {
    return this.http.post<AuthInfoResponse>(`${API_URL}${AUTH_ENDPOINT}`, user)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getUserInfo(): Observable<ActiveUser> {
    return this.http.get<ActiveUser>(`${API_URL}${USER_INFO_ENDPOINT}`);
  }

  // getVendors() {}
  // getVendorById() {}
  // getDiscountById() {}

}

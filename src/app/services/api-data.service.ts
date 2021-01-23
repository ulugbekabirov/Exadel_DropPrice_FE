import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ActiveUser, AuthInfoResponse, AuthUser, Discount, Vendor } from '../models';
import { API_URL, AUTH_ENDPOINT, DISCOUNTS_ENDPOINT, USER_INFO_ENDPOINT, VENDORS_ENDPOINT } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  constructor(private http: HttpClient) {
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error);
  }

  getAuth(user: AuthUser): Observable<AuthInfoResponse> {
    return this.http.post<AuthInfoResponse>(`${API_URL}/${AUTH_ENDPOINT}`, user)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getUserInfo(): Observable<ActiveUser> {
    return this.http
      .get<ActiveUser>(`${API_URL}/${USER_INFO_ENDPOINT}`);
  }

  getVendorById(id: number): Observable<Vendor> {
    return this.http
      .get<Vendor>(`${API_URL}/${VENDORS_ENDPOINT}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getDiscountById(id: number): Observable<Discount> {
    return this.http
      .get<Discount>(`${API_URL}/${DISCOUNTS_ENDPOINT}/${id}`);
  }

  getVendors(): Observable<Vendor[]> {
    return this.http
      .get<Vendor[]>(`${API_URL}/${VENDORS_ENDPOINT}`);
  }

  getDiscounts(): Observable<Discount[]> {
    return this.http
      .get<Discount[]>(`${API_URL}/${DISCOUNTS_ENDPOINT}`);
  }

  editVendor(id: number, vendor: Vendor): Observable<Vendor> {
    return this.http
      .put<Vendor>(`${API_URL}/${VENDORS_ENDPOINT}/${id}`, vendor);
  }
}

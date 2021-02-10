import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActiveUser, AuthInfo, AuthUser, Vendor } from '../models';
import {
  AUTH_ENDPOINT,
  GET_DISCOUNTS_ENDPOINT,
  GET_TAGS_ENDPOINT,
  GET_TICKET_ENDPOINT,
  GET_TOWNS_ENDPOINT, GET_VENDOR_DISCOUNTS_ENDPOINT,
  GET_VENDORS_ENDPOINT, PUT_ARCHIVE_DISCOUNTS_ENDPOINT,
  PUT_IS_SAVED_DISCOUNTS_ENDPOINT, SEARCH_DISCOUNTS_ENDPOINT,
  USER_INFO_ENDPOINT
} from '../../constants';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  constructor(private http: HttpClient) {
  }

  getAuth(user: AuthUser): Observable<AuthInfo> {
    return this.http.post<AuthInfo>(`${environment.identityUrl}${AUTH_ENDPOINT}`, user);
  }

  getUserInfo(): Observable<ActiveUser> {
    return this.http.get<ActiveUser>(`${environment.webApiUrl}${USER_INFO_ENDPOINT}`);
  }

  getDiscounts(options): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}${GET_DISCOUNTS_ENDPOINT}`, options);
  }

  getTowns(): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}${GET_TOWNS_ENDPOINT}`);
  }

  getTags(options): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}${GET_TAGS_ENDPOINT}`, options);
  }

  getTicket(discountId): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}${GET_DISCOUNTS_ENDPOINT}/${discountId}/${GET_TICKET_ENDPOINT}`);
  }

  searchDiscounts(options): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}${GET_DISCOUNTS_ENDPOINT}/${SEARCH_DISCOUNTS_ENDPOINT}`, options);
  }

  updateIsSavedDiscount(id): Observable<any> {
    return this.http.put(`${environment.webApiUrl}${GET_DISCOUNTS_ENDPOINT}/${id}/${PUT_IS_SAVED_DISCOUNTS_ENDPOINT}`, null);
  }

  getDiscountById(discountId): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${GET_DISCOUNTS_ENDPOINT}/${discountId}`);
  }

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${environment.webApiUrl}${GET_VENDORS_ENDPOINT}`);
  }

  getVendorById(vendorId): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${GET_VENDORS_ENDPOINT}/${vendorId}`);
  }

  getVendorsDiscounts(vendorId, options): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${GET_VENDORS_ENDPOINT}/${vendorId}/${GET_VENDOR_DISCOUNTS_ENDPOINT}`, options);
  }

  putDiscountInArchive(id): Observable<any> {
    return this.http.put(`${environment.webApiUrl}${GET_DISCOUNTS_ENDPOINT}/${id}/${PUT_ARCHIVE_DISCOUNTS_ENDPOINT}`, null);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActiveUser, AuthInfo, AuthUser, Vendor } from '../models';
import {
  AUTH_ENDPOINT,
  GET_DISCOUNTS_ENDPOINT,
  GET_TAGS_ENDPOINT,
  GET_TICKET_ENDPOINT,
  GET_TOWNS_ENDPOINT,
  GET_VENDOR_DISCOUNTS_ENDPOINT,
  GET_VENDORS_ENDPOINT,
  POST_DISCOUNTS_ENDPOINT,
  PUT_ARCHIVE_DISCOUNTS_ENDPOINT,
  PUT_IS_SAVED_DISCOUNTS_ENDPOINT,
  SEARCH_DISCOUNTS_ENDPOINT,
  USER_INFO_ENDPOINT,
  GET_POINTOFSALES_ENDPOINT,
  POST_VENDORS_ENDPOINT, CONFIGS, CHANGE_CONFIGS

} from '../../constants';
import { environment } from '../../environments/environment';

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

  getDiscountById(discountId, options): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${GET_DISCOUNTS_ENDPOINT}/${discountId}`, options);
  }

  getPointsOfSalesByDiscountId(discountId): Observable<any>{
    return this.http.get(`${environment.webApiUrl}${GET_DISCOUNTS_ENDPOINT}/${discountId}/${GET_POINTOFSALES_ENDPOINT}`);
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

  createDiscount(discount): any {
    return this.http.post(`${environment.webApiUrl}${POST_DISCOUNTS_ENDPOINT}`, discount);
  }

  updateDiscount(discount, id):any {
    return this.http.put(`${environment.webApiUrl}${POST_DISCOUNTS_ENDPOINT}/${id}`,discount);
  }

  postVendor(vendor): any {
    return this.http.post(`${environment.webApiUrl}${POST_VENDORS_ENDPOINT}`, vendor);
  }

  searchVendors(options): any {
    return this.http.get(`${environment.webApiUrl}${GET_VENDORS_ENDPOINT}/search`, options);
  }

  searchStatsDiscounts(options): any {
    return this.http.get(`${environment.webApiUrl}${GET_DISCOUNTS_ENDPOINT}/stats/search`, options);
  }

  getApiConfigs(): any {
    return this.http.get(`${environment.webApiUrl}${CONFIGS}`);
  }

  putApiConfig(configId, opt): any {
    return this.http.put(`${environment.webApiUrl}${CHANGE_CONFIGS}/${configId}`, {
      id: configId,
      value: opt
    });
  }
}

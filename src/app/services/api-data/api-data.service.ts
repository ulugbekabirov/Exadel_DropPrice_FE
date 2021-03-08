import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActiveUser, AuthInfo, AuthUser, Vendor } from '../../models';
import {
  AUTH_ENDPOINT,
  DISCOUNTS_ENDPOINT,
  GET_TAGS_ENDPOINT,
  GET_TICKET_ENDPOINT,
  GET_POINT_OF_SALES,
  GET_TOWNS_ENDPOINT,
  GET_VENDOR_DISCOUNTS_ENDPOINT,
  GET_VENDORS_ENDPOINT,
  POST_DISCOUNTS_ENDPOINT,
  PUT_ARCHIVE_DISCOUNTS_ENDPOINT,
  PUT_IS_SAVED_DISCOUNTS_ENDPOINT,
  SEARCH_DISCOUNTS_ENDPOINT,
  USER_INFO_ENDPOINT,
  POST_VENDORS_ENDPOINT,
  CONFIGS, CHANGE_CONFIGS,
  PUT_ASSESS_DISCOUNTS_ENDPOINT,
  USER_SAVED_ENDPOINT,
  USER_TICKETS_ENDPOINT, START_EDIT_SESSION_ENDPOINT, END_EDIT_SESSION_ENDPOINT,
} from '../../../constants';
import { environment } from '../../../environments/environment';

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
    return this.http.get<any>(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}`, options);
  }

  getTowns(): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}${GET_TOWNS_ENDPOINT}`);
  }

  getTags(options): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}${GET_TAGS_ENDPOINT}`, options);
  }

  getTicket(discountId): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}/${discountId}/${GET_TICKET_ENDPOINT}`);
  }

  searchDiscounts(options): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}/${SEARCH_DISCOUNTS_ENDPOINT}`, options);
  }

  updateIsSavedDiscount(id): Observable<any> {
    return this.http.put(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}/${id}/${PUT_IS_SAVED_DISCOUNTS_ENDPOINT}`, null);
  }

  getDiscountById(discountId, options): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}/${discountId}`, options);
  }

  getPointsOfSalesByDiscountId(discountId): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}/${discountId}/${GET_POINT_OF_SALES}`);
  }

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${environment.webApiUrl}${GET_VENDORS_ENDPOINT}`);
  }

  getVendorById(vendorId): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${GET_VENDORS_ENDPOINT}/${vendorId}`);
  }

  updateVendor(vendor, vendorId): Observable<any> {
    return this.http.put(`${environment.webApiUrl}${GET_VENDORS_ENDPOINT}/${vendorId}`, vendor);
  }

  getVendorsDiscounts(vendorId, options): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${GET_VENDORS_ENDPOINT}/${vendorId}/${GET_VENDOR_DISCOUNTS_ENDPOINT}`, options);
  }

  getPointOfSales(): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${GET_POINT_OF_SALES}`);
  }

  putDiscountInArchive(id): Observable<any> {
    return this.http.put(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}/${id}/${PUT_ARCHIVE_DISCOUNTS_ENDPOINT}`, null);
  }

  createDiscount(discount): any {
    return this.http.post(`${environment.webApiUrl}${POST_DISCOUNTS_ENDPOINT}`, discount);
  }

  updateDiscount(discount, id): any {
    return this.http.put(`${environment.webApiUrl}${POST_DISCOUNTS_ENDPOINT}/${id}`, discount);
  }

  createVendor(vendor): any {
    return this.http.post(`${environment.webApiUrl}${POST_VENDORS_ENDPOINT}`, vendor);
  }

  searchVendors(options): any {
    return this.http.get(`${environment.webApiUrl}${GET_VENDORS_ENDPOINT}/search`, options);
  }

  searchStatsDiscounts(options): any {
    return this.http.get(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}/stats/search`, options);
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

  putRating(discountId, body): any {
    return this.http.put(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}/${discountId}/${PUT_ASSESS_DISCOUNTS_ENDPOINT}`, body);
  }

  getUserSavedDiscounts(options): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${USER_INFO_ENDPOINT}/${USER_SAVED_ENDPOINT}`, options);
  }

  getUserTickets(options): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${USER_INFO_ENDPOINT}/${USER_TICKETS_ENDPOINT}`, options);
  }

  getVendorPointsOfSales(vendorId): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${GET_VENDORS_ENDPOINT}/${vendorId}/${GET_POINT_OF_SALES}`);
  }

  beginEditDiscount(discountId): any {
    return this.http.put(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}/${discountId}/${START_EDIT_SESSION_ENDPOINT}`, null);
  }

  endEditDiscount(discountId): any {
    return this.http.delete(`${environment.webApiUrl}${DISCOUNTS_ENDPOINT}/${discountId}/${END_EDIT_SESSION_ENDPOINT}`);
  }
}


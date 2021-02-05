import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActiveUser, AuthInfo, AuthUser, Ticket } from '../models';
import {
  AUTH_ENDPOINT,
  GET_DISCOUNTS_ENDPOINT,
  GET_TAGS_ENDPOINT,
  GET_TICKET_ENDPOINT,
  GET_TOWNS_ENDPOINT, PUT_IS_SAVED_DISCOUNTS_ENDPOINT,
  USER_INFO_ENDPOINT
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

  getTicket(options): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}${GET_TICKET_ENDPOINT}`, options);
  }

  updateIsSavedDiscount(id): Observable<any> {
    return this.http.get(`${environment.webApiUrl}${GET_DISCOUNTS_ENDPOINT}/${id}/${PUT_IS_SAVED_DISCOUNTS_ENDPOINT}`);
  }

}

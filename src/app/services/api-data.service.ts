import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActiveUser, AuthInfo, AuthUser, Discount, Tag, Town } from '../models';
import { AUTH_ENDPOINT, GET_DISCOUNTS_ENDPOINT, GET_TAGS_ENDPOINT, GET_TOWNS_ENDPOINT, USER_INFO_ENDPOINT } from '../../constants';
import { environment } from '../../environments/environment';

type GetAuth = (user: AuthUser) => Observable<AuthInfo>;
type GetActiveUser = () => Observable<ActiveUser>;
type GetDiscounts = (skip: number, take: number, longitude: number, latitude: number, sortBy: string) => Observable<Discount[]>;

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
    return this.http.get<ActiveUser>(`${environment.webApi}${USER_INFO_ENDPOINT}`);
  }

  getDiscounts(options): Observable<any> {
    return this.http.get<any>(`${environment.webApi}${GET_DISCOUNTS_ENDPOINT}`, options);
  }

  getTowns(): Observable<any> {
    return this.http.get<any>(`${environment.webApi}${GET_TOWNS_ENDPOINT}`);
  }

  getTags(options): Observable<any> {
    return this.http.get<any>(`${environment.webApi}${GET_TAGS_ENDPOINT}`, options);
  }

}

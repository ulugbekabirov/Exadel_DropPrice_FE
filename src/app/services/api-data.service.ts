import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActiveUser, AuthInfo, AuthUser } from '../models';
import { AUTH_ENDPOINT, USER_INFO_ENDPOINT } from '../../constants';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  constructor(private http: HttpClient) {}

  getAuth(user: AuthUser): Observable<AuthInfo> {
    return this.http.post<AuthInfo>(`${environment.identityUrl}${AUTH_ENDPOINT}`, user);
  }

  getUserInfo(): Observable<ActiveUser> {
    return this.http
      .get<ActiveUser>(`${environment.identityUrl}${USER_INFO_ENDPOINT}`);
  }

  getDiscountInfo(){
    //return this.http.get<Discount>(`${environment.identityUrl}${USER_INFO_ENDPOINT}`);
  }
  getCardsByTag(tag: string){
    console.log(`getCardsByTag: ${tag}`);
    //return this.http.get<Discount>(`${environment.identityUrl}${USER_INFO_ENDPOINT}`);
  }
}

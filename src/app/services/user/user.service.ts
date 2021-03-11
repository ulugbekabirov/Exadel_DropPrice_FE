import { Injectable } from '@angular/core';
import { DiscountsRequestStore } from '../../home/services/discounts-request-store';
import { VendorsRequestStore } from '../../vendors/services/vendors-request-store';
import { ApiDataService } from '../api-data/api-data.service';
import { BehaviorSubject, Observable, of, } from 'rxjs';
import { ActiveUser } from '../../models';
import { KEY_ACTIVE_USER } from '../../../constants';
import { map, pluck, tap } from 'rxjs/operators';
import { LanguageService } from '../language/language.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private activeUserSubject: BehaviorSubject<ActiveUser>;
  public activeUser$: Observable<ActiveUser>;

  constructor(
    private restApi: ApiDataService,
    private languageService: LanguageService,
    private requestVendors: VendorsRequestStore,
    private requestDiscounts: DiscountsRequestStore
  ) {
    this.activeUserSubject = new BehaviorSubject<ActiveUser>(JSON.parse(localStorage.getItem(KEY_ACTIVE_USER)));
    this.activeUser$ = this.activeUserSubject.asObservable();
  }

  select<T>(name: string): Observable<T> {
    return this.activeUser$.pipe(pluck(name));
  }

  set(name: string, state: any): void {
    this.activeUserSubject.next({
      ...this.activeUserValue, [name]: state
    });
  }

  get activeUserValue(): ActiveUser {
    return this.activeUserSubject.value;
  }

  getUserInfo(): Observable<ActiveUser> {
    return this.restApi.getUserInfo()
      .pipe(
        map((user: ActiveUser) => this.getUserPosition(user)),
      );
  }

  private handleActiveUser(user: ActiveUser): any {
    if (this.activeUserValue) {
      this.logout();
    }
    this.activeUserSubject.next(user);
    localStorage.setItem(KEY_ACTIVE_USER, JSON.stringify(user));
  }

  getLocation(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(Error('No support for geolocation'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          resolve({latitude, longitude});
        },
        (error) => {
          reject(error);
        },
        {timeout: 5000}
      );
    });
  }

  getUserPosition(user: ActiveUser): any {
    this.getLocation()
      .then(res => {
        return Object.assign({...user}, {
          latitude: res.latitude,
          longitude: res.longitude
        });
      })
      .then(res => {
        return this.handleActiveUser(res);
      })
      .catch(err => {
        return this.handleActiveUser(user);
      });
  }

  logout(): void {
    localStorage.removeItem(KEY_ACTIVE_USER);
    this.activeUserSubject.next(null);
  }
}

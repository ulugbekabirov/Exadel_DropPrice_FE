import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { BehaviorSubject, Observable, } from 'rxjs';
import { ActiveUser } from '../models';
import { KEY_ACTIVE_USER } from '../../constants';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private activeUserSubject: BehaviorSubject<ActiveUser>;
  public activeUser: Observable<ActiveUser>;

  constructor(
    private restApi: ApiDataService,
  ) {
    this.activeUserSubject = new BehaviorSubject<ActiveUser>(JSON.parse(localStorage.getItem(KEY_ACTIVE_USER)));
    this.activeUser = this.activeUserSubject.asObservable();
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
        {timeout: 5000});
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
        this.handleActiveUser(res);
      });
  }

  logout(): void {
    localStorage.removeItem(KEY_ACTIVE_USER);
    this.activeUserSubject.next(null);
  }
}

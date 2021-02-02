import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { ActiveUser } from '../models';
import { KEY_ACTIVE_USER } from '../../constants';
import { map, switchMap, tap } from 'rxjs/operators';
import { error } from '../fake-back-end/helpers';

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
        tap((user: ActiveUser) => this.handleActiveUser(user)),
        tap((user: ActiveUser) => console.log('USER3', user)),
      );
  }

  private handleActiveUser(user: ActiveUser): void {
    localStorage.setItem(KEY_ACTIVE_USER, JSON.stringify(user));
    this.activeUserSubject.next(user);

  }

  getUserPosition(user: ActiveUser): any {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
      return user;
    }
    const updateUser = Object.assign({}, user);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // this.set('longitude', position.coords.longitude);
        // this.set('latitude', position.coords.latitude);
        Object.assign(updateUser, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    return updateUser;
  }

  set(name: string, field: any): void {
    this.activeUserSubject.next({
      ...this.activeUserValue, [name]: field
    });
  }

  logout(): void {
    localStorage.removeItem(KEY_ACTIVE_USER);
    this.activeUserSubject.next(null);
  }
}

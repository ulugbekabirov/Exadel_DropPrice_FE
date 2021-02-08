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
        map((user: ActiveUser) => this.handleActiveUser(user)),
      );
  }

  private handleActiveUser(user: ActiveUser): any {
    localStorage.setItem(KEY_ACTIVE_USER, JSON.stringify(user));
    this.activeUserSubject.next(user);
    return user;
  }

  getUserPosition(user: ActiveUser): any {
    const updateUser: ActiveUser = {...user};
    if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
        return updateUser;
      }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        Object.assign(updateUser, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.log(error);
      },
      {
        timeout: 5000
      }
    );
    console.log('updateUser', updateUser);
    return updateUser;
  }

  logout(): void {
    localStorage.removeItem(KEY_ACTIVE_USER);
    this.activeUserSubject.next(null);
  }
}

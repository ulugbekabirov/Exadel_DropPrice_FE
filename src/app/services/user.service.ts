import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActiveUser, AuthInfo } from '../models';
import { KEY_AUTH_TOKEN } from '../../constants';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private activeUserSubject: BehaviorSubject<ActiveUser>;
  public activeUser: Observable<ActiveUser>;

  constructor(
    private restApi: ApiDataService,
  ) {
    this.activeUserSubject = new BehaviorSubject<ActiveUser>(JSON.parse(localStorage.getItem(KEY_AUTH_TOKEN)));
    this.activeUser = this.activeUserSubject.asObservable();
  }

  get activeUserValue(): ActiveUser {
    return this.activeUserSubject.value;
  }

  getUserInfo(): Observable<ActiveUser> {
    return this.restApi.getUserInfo()
      .pipe(
        tap((user: ActiveUser) => this.handleActiveUser(user)),
        tap((user: ActiveUser) => console.log('Active User', user))
      );
  }

  private handleActiveUser(user: ActiveUser): void {
    localStorage.setItem(KEY_AUTH_TOKEN, JSON.stringify(user));
    this.activeUserSubject.next(user);
  }
}

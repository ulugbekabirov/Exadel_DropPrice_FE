import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActiveUser } from '../models';
import { KEY_ACTIVE_USER } from '../../constants';
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
    this.activeUserSubject = new BehaviorSubject<ActiveUser>(JSON.parse(localStorage.getItem(KEY_ACTIVE_USER)));
    this.activeUser = this.activeUserSubject.asObservable();
  }

  get activeUserValue(): ActiveUser {
    return this.activeUserSubject.value;
  }

  getUserInfo(): Observable<ActiveUser> {
    return this.restApi.getUserInfo()
      .pipe(
        tap((user: ActiveUser) => this.handleActiveUser(user)),
      );
  }

  private handleActiveUser(user: ActiveUser): void {
    localStorage.setItem(KEY_ACTIVE_USER, JSON.stringify(user));
    this.activeUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem(KEY_ACTIVE_USER);
    this.activeUserSubject.next(null);
  }
}

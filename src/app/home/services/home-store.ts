import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { Discount, Tag, Town } from '../../models';
import { Sort } from '../../models/sort';

export interface HomeState {
  sorts: Sort[] | [];
  tags: Tag[] | [];
  towns: Town[] | [];
  discounts: Discount[] | [];
  activeDiscount: Discount | {};
}

const HOME_INITIAL_STATE: HomeState = {
  sorts: [],
  tags: [],
  towns: [],
  discounts: [],
  activeDiscount: {}
};

@Injectable({
  providedIn: 'root'
})
export class HomeStore {

  private subject: BehaviorSubject<HomeState> = new BehaviorSubject<HomeState>(HOME_INITIAL_STATE);
  private store: Observable<HomeState> = this.subject.asObservable()
    .pipe(
      distinctUntilChanged()
    );

  get value(): any {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.store.pipe(pluck(name));
  }

  set(name: string, state: any): void {
    this.subject.next({
      ...this.value,
      [name]: state
    });
    console.log('this', this.subject.value);
  }
}

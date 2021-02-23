import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { Discount } from 'src/app/models';


export interface DiscountsStatState {
  sorts: string[];
  sortBy: string[];
  searchQuery: string;
  skip: number;
  take: number;
  results: Discount[];
  total: number;
  pageSizes: number[];
}

const DISCOUNTS_STAT_INITIAL_STATE: DiscountsStatState = {
  sorts: ['RatingAsc', 'RatingDesc', 'TicketCountAsc', 'TicketCountDesc'],
  sortBy: ['RatingDesc', 'TicketCountDesc'],
  searchQuery: '',
  results: [],
  total: 0,
  skip: 0,
  take: 5,
  pageSizes: [5, 10, 20]
};

@Injectable({
  providedIn: 'root'
})
export class DiscountsStatStore {

  private subject = new BehaviorSubject<DiscountsStatState>(DISCOUNTS_STAT_INITIAL_STATE);
  private store = this.subject.asObservable()
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
      ...this.value, [name]: state
    });
  }
}

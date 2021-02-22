import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { Discount } from 'src/app/models';


export interface SortState {
  ratingData: any;
  ratingSelected: any;
  ticketCountData: any;
  ticketCountSelected: any;
  sorts: string[];
  sortBy: string[];
  searchQuery: string;
  skip: number;
  take: number;
  results: Discount[];
  total: number;
}

const SEARCH_INITIAL_STATE = {
  ratingData: ['RatingAsc', 'RatingDesc'],
  ratingSelected: 'RatingDesc',
  ticketCountData: ['TicketCountAsc', 'TicketCountDesc'],
  ticketCountSelected: 'TicketCountAsc',
  sorts: ['RatingAsc', 'RatingDesc', 'TicketCountAsc', 'TicketCountDesc'],
  sortBy: ['RatingAsc', 'TicketCountAsc'],
  searchQuery: '',
  skip: 0,
  take: 5,
};

@Injectable({
  providedIn: 'root'
})
export class DiscountsSortStore {

  private subject = new BehaviorSubject<SortState>(SEARCH_INITIAL_STATE);
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
    console.log(this.value);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { Vendor } from '../../models';


export interface VendorsStatState {
  sorts: string[];
  sortBy: string[];
  searchQuery: string;
  skip: number;
  take: number;
  results: Vendor[];
  total: number;
  pageSizes: number[];
}

const VENDORS_STAT_INITIAL_STATE: VendorsStatState = {
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
export class VendorsStatStore {

  private subject = new BehaviorSubject<VendorsStatState>(VENDORS_STAT_INITIAL_STATE);
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

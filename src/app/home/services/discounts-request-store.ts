import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';
import { Tag } from '../../models';
import { Sort } from '../../models/sort';

interface RequestDiscounts {
  request: {
    sortBy: Sort;
    searchQuery: string;
    location: {
      latitude: number | null;
      longitude: number | null;
      townName: string;
    } | null;
    take: number;
    skip: number;
    tags: Tag[];
  };
}

const INITIAL_REQUEST_DISCOUNTS: RequestDiscounts = {
  request: {
    sortBy: {
      name: 'MAIN_PAGE.FILTER.SORT_BY.DISTANCE_ASC.NAME',
      sortBy: 'DistanceAsc',
    },
    searchQuery: '',
    location: {
      latitude: null,
      longitude: null,
      townName: ''
    },
    take: 30,
    skip: 0,
    tags: [],
  }
};

@Injectable({
  providedIn: 'root'
})
export class DiscountsRequestStore {

  private requestSubject: BehaviorSubject<RequestDiscounts> = new BehaviorSubject<RequestDiscounts>(INITIAL_REQUEST_DISCOUNTS);
  private store: Observable<RequestDiscounts> = this.requestSubject.asObservable()
    .pipe(
      distinctUntilChanged()
    );

  requestData$ = this.store.pipe(
    map(requestDiscounts => requestDiscounts.request)
  );

  get value(): any {
    return this.requestSubject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.requestData$.pipe(pluck(name));
  }

  set(name: string, state: any): void {
    const newRequest = {
      ...this.value,
      request: {
        ...this.value.request,
        [name]: state
      }
    };
    this.requestSubject.next(newRequest);
  }

  reset(): void {
    this.requestSubject.next(INITIAL_REQUEST_DISCOUNTS);
  }
}

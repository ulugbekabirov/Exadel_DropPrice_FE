import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';

interface RequestDiscounts {
  request: {
    sortBy: string;
    searchQuery: string;
    latitude: number;
    longitude: number;
    take: number;
    skip: number;
    tags: string[];
  };
}

const INITIAL_REQUEST_DISCOUNTS: RequestDiscounts = {
  request: {
    sortBy: 'DistanceAsc',
    searchQuery: '',
    latitude: 0,
    longitude: 0,
    take: 10,
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
    console.log('REQUEST', this.value);
  }
}

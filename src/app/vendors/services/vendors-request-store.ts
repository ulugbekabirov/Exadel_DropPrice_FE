import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';
import { Sort } from '../../models/sort';

interface RequestVendorsDiscounts {
  request: {
    sortBy: Sort;
    searchQuery: string;
    location: {
      latitude: number | null;
      longitude: number | null;
      townName: string;
    }
    take: number;
    skip: number;
  };
}

const INITIAL_REQUEST_VENDORS_DISCOUNTS: RequestVendorsDiscounts = {
  request: {
    sortBy: {
      name: 'MAIN_PAGE.FILTER.SORT_BY.DISTANCE_DESC.NAME',
      sortBy: 'DistanceDesc',
    },
    searchQuery: '',
    location: {
      latitude: null,
      longitude: null,
      townName: ''
    },
    take: 20,
    skip: 0,
  }
};

@Injectable({
  providedIn: 'root'
})
export class VendorsRequestStore {

  private requestSubject: BehaviorSubject<RequestVendorsDiscounts> =
    new BehaviorSubject<RequestVendorsDiscounts>(INITIAL_REQUEST_VENDORS_DISCOUNTS);

  private store: Observable<RequestVendorsDiscounts> = this.requestSubject.asObservable()
    .pipe(
      distinctUntilChanged()
    );

  requestData$ = this.store.pipe(
    map(requestVendors => requestVendors.request)
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
    this.requestSubject.next(INITIAL_REQUEST_VENDORS_DISCOUNTS);
  }
}

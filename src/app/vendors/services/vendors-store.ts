import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { Discount, Town, Vendor } from '../../models';
import { PointOfSales } from '../../models/point-of-sales';
import { Sort } from '../../models/sort';

export interface VendorState {
  sorts: Sort[] | [];
  vendors: Vendor[] | [];
  discounts: Discount[] | [];
  activeDiscount: Discount | {};
  activeVendor: Vendor | {};
  pointsOfSales: PointOfSales[];
}

const VENDOR_INITIAL_STATE: VendorState = {
  sorts: [],
  vendors: [],
  discounts: [],
  activeDiscount: {},
  activeVendor: {},
  pointsOfSales: []
};


@Injectable({
  providedIn: 'root'
})
export class VendorsStore {
  private subject: BehaviorSubject<VendorState> = new BehaviorSubject<VendorState>(VENDOR_INITIAL_STATE);
  private store: Observable<VendorState> = this.subject.asObservable()
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
  }
}

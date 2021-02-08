import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Ticket, Vendor } from '../models';
import { pluck } from 'rxjs/operators';

const discountsReq = {
  fields: {
    skip: 0,
    take: 10,
    longitude: 0,
    latitude: 0,
    sortBy: 'DistanceAsc',
    searchQuery: '',
    tags: []
  },
};

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {
  private subject = new BehaviorSubject(discountsReq);
  private fields = this.subject.asObservable();

  constructor(
    private restApi: ApiDataService,
  ) {
  }

  get value(): any {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.fields
      .pipe(
        pluck(name)
      );
  }

  set(name: string, field: any): void {
    this.subject.next({
      ...this.value, [name]: field
    });
  }

  getDiscounts(skip, take, longitude, latitude, sortBy?): Observable<any> {
    const options: { params: HttpParams } = {
      params: new HttpParams()
        .set('skip', skip)
        .set('take', take)
        .set('longitude', longitude)
        .set('latitude', latitude)
        .set('sortBy', sortBy)
    };
    return this.restApi.getDiscounts(options);
  }

  getTowns(): Observable<any> {
    return this.restApi.getTowns();
  }

  getTags(skip, take): Observable<any> {
    const options: { params: HttpParams } = {
      params: new HttpParams()
        .set('skip', skip)
        .set('take', take)
    };
    return this.restApi.getTags(options);
  }

  getTicket(discId): Observable<Ticket> {
    const options: { params: HttpParams } = {
      params: new HttpParams()
        .set('discountId', discId)
    };
    return this.restApi.getTicket(discId);
  }

  updateIsSavedDiscount(discId): Observable<any> {
    const options: { params: HttpParams } = {
      params: new HttpParams()
        .set('discountId', discId)
    };
    return this.restApi.updateIsSavedDiscount(discId);
  }

  getDiscountById(discountId): Observable<any> {
    return this.restApi.getDiscountById(discountId);
  }

  getVendors(): Observable<Vendor[]> {
    return this.restApi.getVendors();
  }

  getVendorById(vendorId): Observable<any> {
    return this.restApi.getVendorById(vendorId);
  }

  getVendorsDiscounts(vendorId, options): Observable<any> {
    return this.restApi.getVendorsDiscounts(vendorId, options);
  }

  searchDiscounts(opt): Observable<any> {
    const paramsObj = {};
    Object.keys({...opt}).filter(f => typeof opt[f] !== 'undefined').forEach(p => {
      paramsObj[p] = opt[p];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.searchDiscounts(options);
  }
}

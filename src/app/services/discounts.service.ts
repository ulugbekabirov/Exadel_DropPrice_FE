import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Ticket, Vendor } from '../models';
import { environment } from '../../environments/environment';
import { GET_DISCOUNTS_ENDPOINT, GET_VENDORS_ENDPOINT } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {

  constructor(
    private restApi: ApiDataService,
  ) {}

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
    return this.restApi.getTicket(options);
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

  searchDiscounts({skip, take, longitude, latitude, sortBy, searchQuery, tags}): Observable<any> {
    const options: { params: HttpParams } = {
      params: new HttpParams()
        .set('skip', skip)
        .set('take', take)
        .set('longitude', longitude)
        .set('latitude', latitude)
        .set('sortBy', sortBy)
        .set('searchQuery', searchQuery)
        .set('tags', tags)
    };
    return this.restApi.searchDiscounts(options);
  }
}

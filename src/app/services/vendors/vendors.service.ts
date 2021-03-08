import { Injectable } from '@angular/core';
import { ApiDataService } from '../api-data/api-data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Vendor } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {

  constructor( private restApi: ApiDataService, ) { }

  searchStatsVendors(terms): Observable<any>{
    const paramsObj = {};
    Object.keys({...terms}).filter(value => typeof terms[value] !== 'undefined').forEach(param => {
      paramsObj[param] = terms[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.searchVendors(options);
  }

  createVendor(vendor): any {
    return this.restApi.createVendor(vendor);
  }

  getVendorById(vendorId): Observable<any> {
    return this.restApi.getVendorById(vendorId);
  }

  getVendors(): Observable<Vendor[]> {
    return this.restApi.getVendors();
  }

  updateVendor(vendor, vendorId): Observable<any> {
    return this.restApi.updateVendor(vendor, vendorId);
  }

  getVendorsDiscounts(vendorId, params): Observable<any> {
    const paramsObj = {};
    Object.keys({...params}).filter(value => typeof params[value] !== 'undefined').forEach(param => {
      paramsObj[param] = params[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.getVendorsDiscounts(vendorId, options);
  }

  getVendorPointsOfSales(vendorId): Observable<any> {
    return this.restApi.getVendorPointsOfSales(vendorId);
  }

}

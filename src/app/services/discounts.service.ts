import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DiscountsService {
  constructor(
    private restApi: ApiDataService,
  ) {}

  getDiscounts(params): Observable<any> {
    const paramsObj = {};
    Object.keys({...params}).filter(value => typeof params[value] !== 'undefined').forEach(param => {
      paramsObj[param] = params[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
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

  updateIsSavedDiscount(discountId): Observable<any> {
    return this.restApi.updateIsSavedDiscount(discountId);
  }

  getDiscountById(discountId, params): Observable<any> {
    const paramsObj = {};
    Object.keys({...params}).filter(value => typeof params[value] !== 'undefined').forEach(param => {
      paramsObj[param] = params[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.getDiscountById(discountId, options);
  }

  getPointsOfSalesByDiscountId(discountId) {
    return this.restApi.getPointsOfSalesByDiscountId(discountId);
  }

  searchDiscounts(params): Observable<any> {
    const paramsObj = {};
    Object.keys({...params}).filter(value => typeof params[value] !== 'undefined').forEach(param => {
      paramsObj[param] = params[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.searchDiscounts(options);
  }

  putDiscountInArchive(discountId): Observable<any> {
    return this.restApi.putDiscountInArchive(discountId);
  }

  postDiscount(discount): any {
    return this.restApi.postDiscount(discount);
  }

  updateDiscount(id:number):any {
   return this.restApi.updateIsSavedDiscount(id);
  }

  searchStatsDiscount(terms): any {
    const paramsObj = {};
    Object.keys({...terms}).filter(value => typeof terms[value] !== 'undefined').forEach(param => {
      paramsObj[param] = terms[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.searchStatsDiscounts(options);
  }
}

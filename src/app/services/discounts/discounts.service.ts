import { Injectable } from '@angular/core';
import { DISCOUNTS_ENDPOINT, END_EDIT_SESSION_ENDPOINT, START_EDIT_SESSION_ENDPOINT } from '../../../constants';
import { environment } from '../../../environments/environment';
import { ApiDataService } from '../api-data/api-data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DiscountsService {
  constructor(
    private restApi: ApiDataService,
  ) {
  }

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

  getPointsOfSalesByDiscountId(discountId): Observable<any> {
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

  createDiscount(discount): any {
    return this.restApi. createDiscount(discount);
  }

  updateDiscount(discount, id: number): any {
    return this.restApi.updateDiscount(discount, id);
   }

  searchStatsDiscounts(terms): any {
    const paramsObj = {};
    Object.keys({...terms}).filter(value => typeof terms[value] !== 'undefined').forEach(param => {
      paramsObj[param] = terms[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.searchStatsDiscounts(options);
  }

  putRating(discountId, rating): any {
    const body = {
      assessmentValue: rating
    };
    return this.restApi.putRating(discountId, body);
  }

  getPointOfSales(): Observable<any> {
    return this.restApi.getPointOfSales();
  }

  getUserSavedDiscounts(opt): Observable<any> {
    const paramsObj = {};
    Object.keys({...opt}).filter(value => typeof opt[value] !== 'undefined').forEach(param => {
      paramsObj[param] = opt[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.getUserSavedDiscounts(options);
  }

  getUserOrderedDiscounts(opt): Observable<any> {
    const paramsObj = {};
    Object.keys({...opt}).filter(value => typeof opt[value] !== 'undefined').forEach(param => {
      paramsObj[param] = opt[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    return this.restApi.getUserTickets(options);
  }

  beginEditDiscount(discountId): Observable<any> {
    return this.restApi.beginEditDiscount(discountId);
  }

  endEditDiscount(discountId): Observable<any> {
    return this.restApi.endEditDiscount(discountId);
  }
}

import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { USER_INFO_ENDPOINT, USER_SAVED_ENDPOINT, USER_TICKETS_ENDPOINT } from '../../constants';


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
}

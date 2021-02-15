import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {

  constructor( private restApi: ApiDataService, ) { }

  searchVendors(terms): Observable<any>{
    const paramsObj = {};
    Object.keys({...terms}).filter(value => typeof terms[value] !== 'undefined').forEach(param => {
      paramsObj[param] = terms[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };
    console.log('options', options);
    return this.restApi.searchVendors(options);
  }
}

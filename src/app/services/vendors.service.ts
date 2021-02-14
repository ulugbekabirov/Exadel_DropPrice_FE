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

  searchVendors(term): Observable<any>{
    console.log('this.activeData', term);

    const paramsObj = {};
    Object.keys({...term}).filter(value => typeof term[value] !== 'undefined').forEach(param => {
      paramsObj[param] = term[param];
    });
    const options: { params: HttpParams } = {
      params: new HttpParams({fromObject: paramsObj})
    };

    console.log('options', options);
    return of([term]);
    // return this.restApi.searchVendors(options);
  }
}

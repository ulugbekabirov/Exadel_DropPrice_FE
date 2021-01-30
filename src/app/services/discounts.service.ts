import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {

  constructor(
    private restApi: ApiDataService,
  ) {}

  getDiscounts(skip, take, longitude, latitude, sortBy): Observable<any> {
    return this.restApi.getDiscounts(skip, take, longitude, latitude, sortBy);
  }
}

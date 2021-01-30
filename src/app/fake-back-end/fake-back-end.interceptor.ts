import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import { checkUrl } from './helpers';
import { getDiscounts, getTags, getTowns } from './routes';
import { environment } from '../../environments/environment';
import { GET_DISCOUNTS_ENDPOINT, GET_TAGS_ENDPOINT, GET_TOWNS_ENDPOINT } from '../../constants';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> | any {
    console.log(request);

    const {body} = request;

    return of(null).pipe(
      mergeMap(handleRoute),
      materialize(),
      delay(500),
      dematerialize()
    );

    function handleRoute(): any {
      switch (true) {
        case checkUrl(request, `${environment.identityUrl}${GET_TAGS_ENDPOINT}`):
          return getTags();
        case checkUrl(request, `${environment.identityUrl}${GET_TOWNS_ENDPOINT}`):
          return getTowns();
        case checkUrl(request, `${environment.identityUrl}${GET_DISCOUNTS_ENDPOINT}`):
          return getDiscounts();
        default:
          return next.handle(request);
      }
    }
  }
}

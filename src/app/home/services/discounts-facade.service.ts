import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, from, Observable, of } from 'rxjs';
import { concatMap, debounceTime, distinctUntilChanged, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { SORTS } from '../../../constants';
import { ActiveUser, Discount, Tag, Town } from '../../models';
import { Sort } from '../../models/sort';
import { ApiDataService } from '../../services/api-data.service';
import { DiscountsService } from '../../services/discounts.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { VendorsService } from '../../services/vendors.service';
import { VendorsRequestStore } from '../../vendors/services/vendors-request-store';
import { DiscountsRequestStore } from './discounts-request-store';
import { DiscountsStore } from './discounts-store';

@Injectable({
  providedIn: 'root'
})
export class DiscountsFacadeService {
  constructor(
    private userService: UserService,
    private discountsService: DiscountsService,
    private store: DiscountsStore,
    private requestDiscountsStore: DiscountsRequestStore,
    private ticketService: TicketService,
    private restApi: ApiDataService
  ) {
  }

  isCurrentUserLocation(): boolean {
    return !!(this.userService.activeUserValue.latitude && this.userService.activeUserValue.longitude);
  }

  getUserLocation(): any {
    const userCurrentLocation: Town = {
      townName: 'My location',
      longitude: this.userService.activeUserValue.longitude,
      latitude: this.userService.activeUserValue.latitude,
    };
    const userOfficeLocation: Town = {
      townName: 'My Office Location',
      longitude: this.userService.activeUserValue.officeLongitude,
      latitude: this.userService.activeUserValue.officeLatitude,
    };
    return this.isCurrentUserLocation()
      ? [userCurrentLocation, userOfficeLocation]
      : [userOfficeLocation];
  }

  ifLocationDefined(): boolean {
    return (this.requestDiscountsStore.value.request.location.latitude && this.requestDiscountsStore.value.request.location.longitude);
  }

  loadData(): Observable<any> {
    if (!this.ifLocationDefined()) {
      const user: ActiveUser = this.userService.activeUserValue;
      const location = {
        townName: 'My location',
        latitude: user.latitude ? user.latitude : user.officeLatitude,
        longitude: user.longitude ? user.longitude : user.officeLongitude,
      };
      this.requestDiscountsStore.set('location', location);
    }
    return forkJoin(this.getSorts(), this.getTags(), this.getTowns()).pipe(
      switchMap(() => {
        return this.getDiscounts();
      })
    );
  }

  getTags(): Observable<Tag[]> {
    const skip$: Observable<number> = of(0);
    const take$: Observable<number> = of(18);
    return combineLatest(skip$, take$)
      .pipe(
        switchMap(([skip, take]) => {
          return this.discountsService.getTags(skip, take)
            .pipe(
              tap(tags => this.store.set('tags', tags))
            );
        })
      );
  }

  getTowns(): Observable<Town[]> {
    return this.discountsService.getTowns()
      .pipe(
        map(towns => [...this.getUserLocation(), ...towns]),
        tap(towns => this.store.set('towns', towns))
      );
  }

  getSorts(): Observable<Sort[]> {
    return of(SORTS)
      .pipe(
        tap(sorts => this.store.set('sorts', sorts))
      );
  }

  getDiscounts(debounceMs = 500): Observable<any> {
    return this.requestDiscountsStore.requestData$
      .pipe(
        switchMap((request) => {
          const req = {
            ...request,
            tags: request.tags.map(({tagId}) => tagId),
            sortBy: request.sortBy.sortBy,
            latitude: request.location.latitude,
            longitude: request.location.longitude,
          };
          return this.discountsService.searchDiscounts(req)
            .pipe(
              tap(discounts => this.store.set('discounts', discounts)),
            );
        })
      );
  }

  getDiscount(discountId): Observable<any> {
    return this.requestDiscountsStore.requestData$
      .pipe(
        switchMap((request) => {
          const user = this.userService.activeUserValue;
          const req = {
            latitude: request.location.latitude ? request.location.latitude : user.officeLatitude,
            longitude: request.location.longitude ? request.location.longitude : user.officeLongitude,
          };
          return this.discountsService.getDiscountById(discountId, req)
            .pipe(
              tap(discount => this.store.set('activeDiscount', discount)),
            );
        })
      );
  }

  requestTicket(discountId, ref): void {
    this.restApi.getTicket(discountId)
      .subscribe(ticket => {
        this.ticketService.createTicket(ticket, ref);
      });
  }

  toggleFavourites(discountId): Observable<any> {
    return this.discountsService.updateIsSavedDiscount(discountId);
  }

  putArchiveDiscount(discountId: number): Observable<any> {
    return this.discountsService.putDiscountInArchive(discountId);
  }

  putRating(discountId, assess): Observable<any> {
    return this.discountsService.putRating(discountId, assess);
  }

  throttle<T>(source$: Observable<T>, debounceMs): Observable<T> {
    return source$
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged()
      );
  }
}
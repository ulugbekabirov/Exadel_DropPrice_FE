import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { SORTS } from '../../../constants';
import { ActiveUser, Discount, Tag, Town } from '../../models';
import { PointOfSales } from '../../models/point-of-sales';
import { Sort } from '../../models/sort';
import { ApiDataService } from '../../services/api-data/api-data.service';
import { DiscountsService } from '../../services/discounts/discounts.service';
import { LanguageService } from '../../services/language/language.service';
import { TicketService } from '../../services/ticket/ticket.service';
import { TownsService } from '../../services/towns/towns.service';
import { UserService } from '../../services/user/user.service';
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
    private restApi: ApiDataService,
    private translate: TranslateService,
    private townsService: TownsService,
  ) {
  }

  isCurrentUserLocation(): boolean {
    return !!(this.userService.activeUserValue.latitude && this.userService.activeUserValue.longitude);
  }

  getUserLocation(): any {
    const userCurrentLocation: Town = {
      townName: this.translate.instant('MAIN_PAGE.FILTER.LOCATION_SORT.CURRENT'),
      longitude: this.userService.activeUserValue.longitude,
      latitude: this.userService.activeUserValue.latitude,
    };
    const userOfficeLocation: Town = {
      townName: this.translate.instant('MAIN_PAGE.FILTER.LOCATION_SORT.OFFICE'),
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
        townName: this.translate.instant('MAIN_PAGE.FILTER.LOCATION_SORT.CURRENT'),
        latitude: user.latitude ? user.latitude : user.officeLatitude,
        longitude: user.longitude ? user.longitude : user.officeLongitude,
      };
      this.requestDiscountsStore.set('location', location);
    }
    return forkJoin(
      this.getSorts(),
      this.getTags(),
      this.getTowns()
    ).pipe(
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
    return this.townsService.getTowns()
      .pipe(
        map(towns => [...this.getUserLocation(), ...towns]),
        tap(towns => this.townsService.set('towns', towns))
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
          const {location, ...fixRequest} = req;
          return this.discountsService.searchDiscounts(fixRequest)
            .pipe(
              map(discounts => {
                return discounts.map(discount => {
                  const {endDate, startDate} = discount;
                  const dateNow = Date.now();
                  const discountAvailable = (dateNow > new Date(startDate).getTime() && dateNow < new Date(endDate).getTime());
                  return {...discount, discountAvailable};
                });
              }),
              tap(discounts => this.store.set('discounts', discounts)),
            );
        })
      );
  }

  getDiscount(discountId, request): Observable<Discount> {
    return this.discountsService.getDiscountById(discountId, request)
      .pipe(
        map(discount => {
          const {endDate, startDate} = discount;
          const dateNow = Date.now();
          const discountAvailable = (dateNow > new Date(startDate).getTime() && dateNow < new Date(endDate).getTime());
          return {...discount, discountAvailable};
        }),
        tap(discount => this.store.set('activeDiscount', discount)),
      );
  }

  getDiscountPointsOfSales(discountId): Observable<PointOfSales[]> {
    return this.discountsService.getPointsOfSalesByDiscountId(discountId)
      .pipe(
        tap(points => this.store.set('pointsOfSales', points))
      );
  }

  loadDiscountData(discountId): Observable<any> {
    if (!this.ifLocationDefined()) {
      const user: ActiveUser = this.userService.activeUserValue;
      const location = {
        townName: 'My location',
        latitude: user.latitude ? user.latitude : user.officeLatitude,
        longitude: user.longitude ? user.longitude : user.officeLongitude,
      };
      this.requestDiscountsStore.set('location', location);
    }
    return this.requestDiscountsStore.requestData$
      .pipe(
        switchMap((request) => {
          const user = this.userService.activeUserValue;
          const req = {
            latitude: request.location.latitude ? request.location.latitude : user.officeLatitude,
            longitude: request.location.longitude ? request.location.longitude : user.officeLongitude,
          };
          return forkJoin(
            this.getDiscount(discountId, req),
            this.getDiscountPointsOfSales(discountId)
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

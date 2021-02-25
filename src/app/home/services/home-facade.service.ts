import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, from, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { SORTS } from '../../../constants';
import { Discount, Tag, Town } from '../../models';
import { Sort } from '../../models/sort';
import { ApiDataService } from '../../services/api-data.service';
import { DiscountsService } from '../../services/discounts.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { DiscountsRequestStore } from './discounts-request-store';
import { HomeStore } from './home-store';

@Injectable()
export class HomeFacadeService {
  constructor(
    private userService: UserService,
    private discountsService: DiscountsService,
    private homeStore: HomeStore,
    private requestStore: DiscountsRequestStore,
    private ticketService: TicketService,
    private restApi: ApiDataService
  ) {
  }

  loadData(): Observable<any> {
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
    const take$: Observable<number> = of(5);
    return combineLatest(skip$, take$)
      .pipe(
        switchMap(([skip, take]) => {
          return this.discountsService.getTags(skip, take)
            .pipe(
              tap(tags => this.homeStore.set('tags', tags))
            );
        })
      );
  }

  getTowns(): Observable<Town[]> {
    return this.discountsService.getTowns()
      .pipe(
        tap(towns => this.homeStore.set('towns', towns))
      );
  }

  getSorts(): Observable<Sort[]> {
    return of(SORTS)
      .pipe(
        tap(sorts => this.homeStore.set('sorts', sorts))
      );
  }

  getDiscounts(debounceMs = 500): Observable<any> {
    return this.requestStore.requestData$
      .pipe(
        tap(next => console.log(next)),
        switchMap((request) => {
          const req = {
            ...request,
            tags: request.tags.map(({tagId}) => tagId),
            sortBy: request.sortBy.sortBy,
            latitude: request.location.latitude,
            longitude: request.location.longitude,
          };
          console.log(request);
          console.log(req);
          return this.discountsService.searchDiscounts(req)
            .pipe(
              tap(discounts => this.homeStore.set('discounts', discounts)),
            );
        })
      );
  }

  requestTicket(discountId, ref): void {
    this.restApi.getTicket(discountId).pipe(
    ).subscribe(ticket => {
      this.ticketService.createTicket(ticket, ref);
    });
  }

  toggleFavourites(discountId): void {
    const value: Discount[] = this.homeStore.value.discounts;
    this.discountsService.updateIsSavedDiscount(discountId)
      .subscribe(resp => {
        const discounts = value.map((discount: Discount) => {
          return discount.discountId === resp.discountID
            ? {...discount, isSaved: resp.isSaved}
            : {...discount};
        });
        this.homeStore.set('discounts', discounts);
      });
  }

  throttle<T>(source$: Observable<T>, debounceMs): Observable<T> {
    return source$
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged()
      );
  }
}

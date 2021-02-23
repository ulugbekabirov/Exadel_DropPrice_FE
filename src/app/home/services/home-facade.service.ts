import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, from, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { SORTS } from '../../../constants';
import { Tag, Town } from '../../models';
import { Sort } from '../../models/sort';
import { ApiDataService } from '../../services/api-data.service';
import { DiscountsService } from '../../services/discounts.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { HomeStore } from './home-store';

@Injectable()
export class HomeFacadeService {
  constructor(
    private userService: UserService,
    private discountsService: DiscountsService,
    private homeStore: HomeStore,
    private ticketService: TicketService,
    private restApi: ApiDataService
  ) {
  }

  getHomeData(): Observable<any> {
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
    const take$: Observable<number> = of(10);
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
    const searchQuery$: Observable<string> = this.throttle(this.homeStore.select('searchQuery'), debounceMs);
    const take$: Observable<number> = this.throttle(this.homeStore.select('take'), debounceMs);
    const skip$: Observable<number> = this.throttle(this.homeStore.select('skip'), debounceMs);
    const latitude$: Observable<number> = this.throttle(this.homeStore.select('latitude'), debounceMs);
    const longitude$: Observable<number> = this.throttle(this.homeStore.select('longitude'), debounceMs);
    const sortBy$: Observable<string> = this.throttle(this.homeStore.select('sortBy'), debounceMs);
    const tags$: Observable<string[]> = this.homeStore.select('requestTags');
    return combineLatest(searchQuery$, take$, skip$, latitude$, longitude$, sortBy$, tags$)
      .pipe(
        switchMap(([searchQuery, take, skip, latitude, longitude, sortBy, tags]) => {
          return this.discountsService.getDiscounts({searchQuery, take, skip, latitude, longitude, sortBy, tags})
            .pipe(
              tap(discounts => this.homeStore.set('discounts', discounts)),
              tap(next => console.log('next', next))
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
    this.discountsService.updateIsSavedDiscount(discountId)
      .pipe();
  }

  throttle<T>(source$: Observable<T>, debounceMs): Observable<T> {
    return source$
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged()
      );
  }
}

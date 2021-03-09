import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinct, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { RefDirective } from '../../../directives/ref/ref.directive';
import { Discount, Tag, Town } from '../../../models';
import { Sort } from '../../../models/sort';
import { DiscountsRequestStore } from '../../services/discounts-request-store';
import { DiscountsFacadeService } from '../../services/discounts-facade.service';
import { DiscountsStore } from '../../services/discounts-store';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit, OnDestroy {
  // discounts$: Observable<Discount[]>;
  towns$: Observable<Town[]>;
  tags$: Observable<Tag[]>;
  sorts$: Observable<Sort[]>;
  searchTerm$: Observable<string>;
  location$: Observable<Town>;
  activeTags$: Observable<Tag[]>;
  sortBy$: Observable<Sort>;
  private unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  private cache = [];
  private pageByManual$ = new BehaviorSubject(1);
  private itemHeight = 280;
  private numberOfItems = 8;

  private pageByScroll$ = fromEvent(window, 'scroll')
    .pipe(
      map(() => window.scrollY),
      filter(current => current >= document.body.clientHeight - window.innerHeight),
      debounceTime(200),
      distinct(),
      map(y => Math.ceil((y + window.innerHeight) / (this.itemHeight * this.numberOfItems))),
      tap(scroll => console.log('PAGE_BY_SCROLL', scroll))
    );

  private pageByResize$ = fromEvent(window, 'resize')
    .pipe(
      debounceTime(200),
      map(_ => Math.ceil(
        (window.innerHeight + document.body.scrollTop) /
        (this.itemHeight * this.numberOfItems)
      ))
    );

  private pageToLoad$ = merge(this.pageByManual$, this.pageByScroll$, this.pageByResize$)
    .pipe(
      // distinct(),
      filter(page => this.cache[page - 1] === undefined)
    );

  constructor(
    private store: DiscountsStore,
    private facade: DiscountsFacadeService,
    private sortStore: DiscountsRequestStore,
  ) {
  }

  discounts$ = this.pageToLoad$
    .pipe(
      tap(next => console.log('PAGE', next)),
      tap(page => this.sortStore.set('skip', (8 * (page - 1)))),
      switchMap((page: number) => {
        console.log('page', page);
        return this.store.select('discounts')
          .pipe(
            tap(resp => {
              this.cache[page - 1] = resp;
              console.log('CACHE1', this.cache);
              if ((this.itemHeight * this.numberOfItems * page) < window.innerHeight) {
                this.pageByManual$.next(page + 1);
              }
            })
          );
      }),
      map(() => this.cache.reduce((acc, val) => [...acc, ...val])),
      tap(() => console.log(this.cache))
    );


  ngOnInit(): void {
    this.facade.loadData().subscribe();
    // .pipe(
    //   switchMap((): Observable<Discount[]> => {
    //     return this.store.select('discounts');
    //   }),
    //   takeUntil(this.unsubscribe$),
    // );
    this.sorts$ = this.store.select('sorts');
    this.tags$ = this.store.select('tags');
    this.towns$ = this.store.select('towns');

    this.searchTerm$ = this.sortStore.select('searchQuery');
    this.activeTags$ = this.sortStore.select('tags');
    this.sortBy$ = this.sortStore.select('sortBy');
    this.location$ = this.sortStore.select('location');
  }

  getTicket(discountId: number): void {
    this.facade.requestTicket(discountId, this.refDir);
  }

  changeFavourites(discountId: number): void {
    this.facade.toggleFavourites(discountId)
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(resp => {
      const value: Discount[] = this.store.value.discounts;
      const activeDiscount = this.store.value.activeDiscount;
      const discounts = value.map((discount: Discount) => {
        return discount.discountId === resp.discountID
          ? {...discount, isSaved: resp.isSaved}
          : {...discount};
      });
      if (activeDiscount.discountId === resp.discountID) {
        const discount = {...activeDiscount, isSaved: resp.isSaved};
        this.store.set('activeDiscount', discount);
      }
      this.store.set('discounts', discounts);
    });
  }

  onLocationChange(location): void {
    this.resetCache();
    this.sortStore.set('location', location);
  }

  onSortChange(sortBy): void {
    this.resetCache();
    this.sortStore.set('sortBy', sortBy);
  }

  searchTermChange(searchQuery: string): void {
    this.resetCache();
    this.sortStore.set('searchQuery', searchQuery);
  }

  searchTagChange(tags): void {
    this.resetCache();
    this.sortStore.set('tags', tags);
  }

  resetCache(): void {
    this.sortStore.set('skip', 0);
    this.cache = [];
    this.pageByManual$.next(1);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

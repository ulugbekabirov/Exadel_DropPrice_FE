import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { RefDirective } from '../../../directives/ref/ref.directive';
import { Discount, Tag, Town } from '../../../models';
import { Sort } from '../../../models/sort';
import { TownsService } from '../../../services/towns/towns.service';
import { DiscountsRequestStore } from '../../services/discounts-request-store';
import { DiscountsFacadeService } from '../../services/discounts-facade.service';
import { DiscountsStore } from '../../services/discounts-store';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit, OnDestroy {
  discounts$: Observable<Discount[]>;
  towns$: Observable<Town[]>;
  tags$: Observable<Tag[]>;
  sorts$: Observable<Sort[]>;
  searchTerm$: Observable<string>;
  location$: Observable<Town>;
  activeTags$: Observable<Tag[]>;
  sortBy$: Observable<Sort>;
  private unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;


  constructor(
    private store: DiscountsStore,
    private facade: DiscountsFacadeService,
    private sortStore: DiscountsRequestStore,
    private townsService: TownsService
  ) {
  }

  ngOnInit(): void {
    this.discounts$ = this.facade.loadData()
      .pipe(
        switchMap((): Observable<Discount[]> => {
          return this.store.select('discounts');
        }),
        takeUntil(this.unsubscribe$),
      );
    this.sorts$ = this.store.select('sorts');
    this.tags$ = this.store.select('tags');
    this.towns$ = this.townsService.select('towns');

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
    this.sortStore.set('location', {...location});
  }

  onSortChange(sortBy): void {
    this.sortStore.set('sortBy', sortBy);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchTermChange(searchQuery: string): void {
    this.sortStore.set('searchQuery', searchQuery);
  }

  searchTagChange(tags): void {
    this.sortStore.set('tags', tags);
  }

  onChangePage(skip: any): void {
    this.sortStore.set('skip', skip);
  }
}

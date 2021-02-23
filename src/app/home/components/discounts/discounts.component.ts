import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { RefDirective } from '../../../directives/ref.directive';
import { ActiveUser, Discount, Tag, Town } from '../../../models';
import { Sort } from '../../../models/sort';
import { HomeFacadeService } from '../../services/home-facade.service';
import { HomeStore } from '../../services/home-store';

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
  activeUser$: Observable<ActiveUser>;

  requestTags$;
  sortBy;
  private unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;


  constructor(
    private store: HomeStore,
    private facade: HomeFacadeService,
  ) {
  }

  ngOnInit(): void {
    this.discounts$ = this.facade.loadData()
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((): Observable<Discount[]> => {
          return this.store.select('discounts');
        })
      );
    // this.discounts$ = this.store.select('discounts');
    this.sorts$ = this.store.select('sorts');
    this.tags$ = this.store.select('tags');
    this.towns$ = this.store.select('towns');
    this.searchTerm$ = this.store.select('searchQuery');
    this.requestTags$ = this.store.select('requestTags');
    this.sortBy$ = this.store.select('sortBy');
  }

  getTicket(discountId: number): void {
    this.facade.requestTicket(discountId, this.refDir);
  }

  changeFavourites(discountId: number): void {
    this.facade.toggleFavourites(discountId);
  }

  onSearchQueryChange({name, tag}): void {
    this.store.set('searchQuery', name);
    this.store.set('requestTags', [...tag]);
  }

  onLocationChange({value: {latitude, longitude}}): void {
    this.store.set('latitude', latitude);
    this.store.set('longitude', longitude);
  }

  onSortChange({value: {sortBy}}): void {
    this.store.set('sortBy', sortBy);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { pluck, switchMap, takeUntil } from 'rxjs/operators';
import { RefDirective } from '../../../directives/ref.directive';
import { ActiveUser, Discount, Tag, Town } from '../../../models';
import { Sort } from '../../../models/sort';
import { DiscountsRequestStore } from '../../services/discounts-request-store';
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
  location$;
  activeTags$;
  sortBy$;
  private unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;


  constructor(
    private store: HomeStore,
    private facade: HomeFacadeService,
    private sortStore: DiscountsRequestStore,
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
    this.facade.toggleFavourites(discountId);
  }

  onSearchQueryChange({name, tag}): void {
    this.sortStore.set('searchQuery', name);
    this.sortStore.set('tags', [...tag]);
  }

  onLocationChange(location): void {
    console.log(location)
    this.sortStore.set('location', location);
  }

  onSortChange(sortBy): void {
    console.log(sortBy)
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
    console.log(tags);
    this.sortStore.set('tags', tags);
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinct, distinctUntilChanged, filter, flatMap, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DiscountsStatStore } from '../../../admin-dashboard/services/discounts-stat-store';
import { DiscountsFacadeService } from '../../../home/services/discounts-facade.service';
import { DiscountsRequestStore } from '../../../home/services/discounts-request-store';
import { DiscountsStore } from '../../../home/services/discounts-store';
import { LocationCoords, Town } from '../../../models';
import { Sort } from '../../../models/sort';
import { DiscountsService } from '../../../services/discounts.service';

@Component({
  selector: 'app-discounts-list',
  templateUrl: './discounts-list.component.html',
  styleUrls: ['./discounts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DiscountsListComponent implements OnInit, OnDestroy {

  constructor(
    private facade: DiscountsFacadeService,
    private requestStore: DiscountsRequestStore,
    private discountsService: DiscountsService,
    private store: DiscountsStore
  ) {
  }

  @Output() locationChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  @Output() getTicket = new EventEmitter<any>();
  @Output() toggleFavourites = new EventEmitter<any>();
  @Output() toggleCoordinates = new EventEmitter<any>();
  @Input() activeCoords$: LocationCoords;

  @Input() discounts$: Observable<any>;
  @Input() sorts$: Observable<Sort[]>;
  @Input() towns$: Observable<Town[]>;
  @Input() sortBySelected$: Observable<Sort>;
  @Input() locationSelected$: Observable<Town>;
  private unsubscribe$: Subject<void> = new Subject<void>();
  mainSortBy: FormControl = new FormControl();
  locationSort: FormControl = new FormControl();

  private cache = [];
  private pageByManual$ = new BehaviorSubject(1);
  private itemHeight = 280;
  private numberOfItems = 6;

  private pageByScroll$ = fromEvent(window, 'scroll')
    .pipe(
      map(() => window.scrollY),
      filter(current => current >= document.body.clientHeight - window.innerHeight),
      debounceTime(200),
      distinct(),
      map(y => Math.ceil((y + window.innerHeight) / (this.itemHeight * this.numberOfItems)))
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
      tap(next => console.log('PAGE', next)),
      distinct(),
      filter(page => this.cache[page - 1] === undefined)
    );

  itemResults$ = this.pageToLoad$
    .pipe(
      tap(page => this.requestStore.set('skip', (12 * (page - 1)))),
      switchMap((page: number) => {
        return this.discounts$
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

    this.sortBySelected$.pipe(
      switchMap((sortBy) => {
        this.mainSortBy.patchValue(sortBy);
        return this.throttle(this.mainSortBy.valueChanges);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(next => {
      this.cache = [];
      this.sortChange.emit(next);
    });

    this.locationSelected$.pipe(
      switchMap((coords) => {
        this.locationSort.patchValue(coords);
        return this.throttle(this.locationSort.valueChanges);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(next => {
      this.cache = [];
      this.locationChange.emit(next);
    });
  }

  requestTicket(discountId: any): void {
    this.getTicket.emit(discountId);
  }

  getToggleFavourites(id: number): void {
    this.toggleFavourites.emit(id);
  }

  throttle(source$: Observable<string>): any {
    return source$.pipe(debounceTime(500), distinctUntilChanged());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

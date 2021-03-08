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

  private itemHeight = 280;
  private numberOfItems = 6;

  ngOnInit(): void {

    this.sortBySelected$.pipe(
      switchMap((sortBy) => {
        this.mainSortBy.patchValue(sortBy);
        return this.throttle(this.mainSortBy.valueChanges);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(next => {
      this.sortChange.emit(next);
    });

    this.locationSelected$.pipe(
      switchMap((coords) => {
        this.locationSort.patchValue(coords);
        return this.throttle(this.locationSort.valueChanges);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(next => {
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

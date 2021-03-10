import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { LocationCoords, Town } from '../../../models';
import { Sort } from '../../../models/sort';

@Component({
  selector: 'app-discounts-list',
  templateUrl: './discounts-list.component.html',
  styleUrls: ['./discounts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DiscountsListComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Output() locationChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  @Output() getTicket = new EventEmitter<any>();
  @Output() toggleFavourites = new EventEmitter<any>();
  @Output() toggleCoordinates = new EventEmitter<any>();
  @Output() columnCountChecked = new EventEmitter<any>();
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


  @ViewChild('scrollList', { read: ElementRef }) scrollList: ElementRef;
  @ViewChild('scrollItem', { read: ElementRef }) scrollItem: ElementRef;

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
        this.locationSort.patchValue(coords, {emitModelToViewChange: true});
        return this.throttle(this.locationSort.valueChanges);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(next => {
      this.locationChange.emit(next);
    });
  }

  ngAfterViewInit(): void {

  }

  ngAfterViewChecked(): void {
    if (!this.scrollList || !this.scrollItem) {
      return;
    }
    this.columnCountChecked.emit(Math.round(this.scrollList.nativeElement.offsetWidth / this.scrollItem.nativeElement.offsetWidth));
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

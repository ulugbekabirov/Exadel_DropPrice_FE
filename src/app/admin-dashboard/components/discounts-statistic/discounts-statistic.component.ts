import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { StatisticsFacadeService } from '../../services/statistics-facade.service';
import { DiscountsSortStore } from '../../services/discounts-sorts-store';
import { MatSort } from '@angular/material/sort';
import { Discount } from 'src/app/models';

@Component({
  selector: 'app-discounts-statistic',
  templateUrl: './discounts-statistic.component.html',
  styleUrls: ['./discounts-statistic.component.scss']
})

export class DiscountsStatisticComponent implements OnInit, OnDestroy, AfterViewInit {
  ratingSort = new FormControl();
  ticketCountSort = new FormControl();
  dataSource;
  displayedColumns: string[] = ['name', 'rating', 'ticketCount'];
  sortRating$: Observable<any>;
  sortTicketCount$: Observable<any>;
  searchResults$;
  searchTerm$: any;
  resultsLength: number;
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private facade: StatisticsFacadeService,
    private sortStore: DiscountsSortStore,
  ) {
    this.facade.searchDiscounts()
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(next => console.log(next));

    this.sortRating$ = this.sortStore.select('ratingData');
    this.sortTicketCount$ = this.sortStore.select('ticketCountData');
    this.searchTerm$ = this.sortStore.select('searchQuery');
  }

  ngOnInit(): void {
    this.facade.select('results')
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe((result: Discount[]) => {
      this.dataSource = new MatTableDataSource(result);
    });
    this.facade.select('total').pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((total: number) => {
      this.resultsLength = total;
    });

    this.ratingSort.valueChanges.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(next => this.sortStore.set('ratingSelected', next));
    this.ticketCountSort.valueChanges.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(next => this.sortStore.set('ticketCountSelected', next));
  }

  ngAfterViewInit(): void {
    const sort$ = this.sort.sortChange;
    const paginator$ = this.paginator.page;
    merge(sort$, paginator$)
      .pipe(
        startWith({}),
        takeUntil(this.unsubscribe$)
      ).subscribe((data) => this.facade.updateDiscountsSort(data));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchTermChange(query): void {
    this.sortStore.set('searchQuery', query);
  }
}

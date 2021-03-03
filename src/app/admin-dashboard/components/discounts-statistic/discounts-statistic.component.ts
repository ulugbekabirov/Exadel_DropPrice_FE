import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { StatisticsFacadeService } from '../../services/statistics-facade.service';
import { DiscountsStatStore } from '../../services/discounts-stat-store';
import { MatSort } from '@angular/material/sort';
import { Discount } from 'src/app/models';

@Component({
  selector: 'app-discounts-statistic',
  templateUrl: './discounts-statistic.component.html',
  styleUrls: ['./discounts-statistic.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DiscountsStatisticComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['name', 'rating', 'ticketCount'];
  dataSource$: Observable<Discount[]>;
  searchTerm$: Observable<string>;
  resultsLength$: Observable<number>;
  pageSizes$: Observable<number[]>;
  pageSize$: Observable<number>;
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private facade: StatisticsFacadeService,
    private discountsStatStore: DiscountsStatStore,
  ) {}

  ngOnInit(): void {
    this.dataSource$ = this.facade.searchDiscounts()
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((): Observable<Discount[]> => {
          return this.discountsStatStore.select('results');
        })
      );
    this.searchTerm$ = this.discountsStatStore.select('searchQuery');
    this.resultsLength$ = this.discountsStatStore.select('total');
    this.pageSizes$ = this.discountsStatStore.select('pageSizes');
    this.pageSize$ = this.discountsStatStore.select('take');
  }

  ngAfterViewInit(): void {
    const sort$ = this.sort.sortChange;
    const paginator$ = this.paginator.page;
    merge(sort$, paginator$)
      .pipe(
        startWith({}),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data: any) => this.facade.updateDiscountsSort(data));
  }

  searchTermChange(query): void {
    this.discountsStatStore.set('searchQuery', query);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

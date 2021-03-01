import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Observable, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Vendor } from '../../../models';
import { StatisticsFacadeService } from '../../services/statistics-facade.service';
import { VendorsStatStore } from '../../services/vendors-stat-store';

@Component({
  selector: 'app-vendor-statistics',
  templateUrl: './vendor-statistics.component.html',
  styleUrls: ['./vendor-statistics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VendorStatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['name', 'rating', 'ticketCount', 'email'];
  dataSource$: Observable<Vendor[]>;
  searchTerm$: Observable<string>;
  resultsLength$: Observable<number>;
  pageSizes$: Observable<number[]>;
  pageSize$: Observable<number>;
  private unsubscribe$: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private facade: StatisticsFacadeService,
    private vendorsStatStore: VendorsStatStore
  ) {
  }

  ngOnInit(): void {
    this.dataSource$ = this.facade.searchVendors()
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((): Observable<Vendor[]> => {
          return this.vendorsStatStore.select('results');
        })
      );
    this.resultsLength$ = this.vendorsStatStore.select('total');
    this.pageSizes$ = this.vendorsStatStore.select('pageSizes');
    this.searchTerm$ = this.vendorsStatStore.select('searchQuery');
    this.pageSize$ = this.vendorsStatStore.select('take');
  }

  ngAfterViewInit(): void {
    const sort$ = this.sort.sortChange;
    const paginator$ = this.paginator.page;
    merge(sort$, paginator$)
      .pipe(
        startWith({}),
        takeUntil(this.unsubscribe$)
      ).subscribe((data: any) => this.facade.updateVendorsSort(data));
  }

  searchTermChange(query): void {
    this.vendorsStatStore.set('searchQuery', query);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

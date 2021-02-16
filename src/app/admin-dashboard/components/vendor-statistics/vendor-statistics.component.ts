import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { StatisticsFacadeService } from '../../services/statistics-facade.service';
import { VendorsSortStore } from '../../services/vendors-sort-store';

@Component({
  selector: 'app-vendor-statistics',
  templateUrl: './vendor-statistics.component.html',
  styleUrls: ['./vendor-statistics.component.scss']
})
export class VendorStatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  ratingSort = new FormControl();
  ticketCountSort = new FormControl();
  dataSource;
  displayedColumns: string[] = ['name', 'rating', 'ticketCount', 'email'];
  sortRating$: Observable<any>;
  sortTicketCount$: Observable<any>;
  searchResults$;
  searchTerm$;
  resultsLength: any;
  private unsubscribe$ = new Subject<void>();


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private facade: StatisticsFacadeService,
    private sortStore: VendorsSortStore
  ) {
    this.searchResults$ = this.facade.searchVendors();
    this.sortRating$ = this.sortStore.select('ratingData');
    this.sortTicketCount$ = this.sortStore.select('ticketCountData');
    this.searchTerm$ = this.sortStore.select('searchQuery');
  }

  ngOnInit(): void {
    this.searchResults$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(results => this.dataSource = new MatTableDataSource(results));
    this.ratingSort.valueChanges.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(next => this.sortStore.set('ratingSelected', next));
    this.ticketCountSort.valueChanges.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(next => this.sortStore.set('ticketCountSelected', next));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(next => {
      this.sortStore.set('take', next.pageSize);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchTermChange(query): void {
    this.sortStore.set('searchQuery', query);
  }
}

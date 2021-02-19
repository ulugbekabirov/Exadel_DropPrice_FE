import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';
import { StatisticsFacadeService } from '../../services/statistics-facade.service';
import { DiscountsSortStore } from '../../services/discounts-sorts-store';

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
  resultsLength: any;
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private facade: StatisticsFacadeService,
    private sortStore: DiscountsSortStore,
  ) {
    this.searchResults$ = this.facade.searchDiscounts();
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
    ).subscribe(next => this.sortStore.set('take', next.pageSize));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchTermChange(query): void {
    this.sortStore.set('searchQuery', query);
  }
}

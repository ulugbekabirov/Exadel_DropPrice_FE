import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SearchFacade } from '../../services/search-facade';
import { MatTableDataSource } from '@angular/material/table';
import { DiscountSortsStore } from '../../services/discount-sorts-store';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  // @Input() searchResults$;
  // @Input() sortRating$;
  // @Input() sortTicketCount$;
  // @Input() ratingSort = new FormControl();
  ratingSort = new FormControl();
  // @Input() ticketCountSort = new FormControl();
  ticketCountSort = new FormControl();
  dataSource;
  displayedColumns: string[] = ['name', 'rating', 'ticketCount'];
  subscription: Subscription;
  searchResults$ = this.facade.searchDiscounts();
  sortRating$: Observable<any>;
  sortTicketCount$: Observable<any>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchTerm$: any;

  constructor(
    private facade: SearchFacade,
    private sortStore: DiscountSortsStore
  ) {
    this.sortRating$ = this.sortStore.sortRatingData$;
    this.sortTicketCount$ = this.sortStore.sortTicketCountData$;
    this.searchTerm$ = this.sortStore.searchQuery$;
  }

  ngOnInit(): void {
    this.subscription = this.searchResults$.subscribe(results => this.dataSource = new MatTableDataSource(results));
    this.ratingSort.valueChanges.subscribe(next => this.sortStore.setRatingSelected(next));
    this.ticketCountSort.valueChanges.subscribe(next => this.sortStore.setTicketCountSelected(next));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.sort);
    this.sort.sortChange.subscribe(next => console.log(next));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchTermChange(query): void {
    console.log('query', query);
    this.sortStore.setSearchQuery(query);
  }
}

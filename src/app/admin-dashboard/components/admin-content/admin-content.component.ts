import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SearchFacade } from '../../services/search-facade';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, Subscription } from 'rxjs';
import { SortStore } from '../../services/sort-store';
import { FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss']
})
export class AdminContentComponent implements OnInit, AfterViewInit, OnDestroy {
  // @Input() searchResults$;
  // @Input() sortRating$;
  // @Input() sortTicketCount$;
  // @Input() ratingSort = new FormControl();
  ratingSort = new FormControl();
  // @Input() ticketCountSort = new FormControl();
  ticketCountSort = new FormControl();
  dataSource;
  displayedColumns: string[] = ['name', 'rating', 'ticketCount', 'email'];
  subscription: Subscription;
  searchResults$ = this.facade.searchVendors();
  sortRating$: Observable<any>;
  sortTicketCount$: Observable<any>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchTerm$;

  constructor(
    private facade: SearchFacade,
    private sortStore: SortStore
  ) {
    this.sortRating$ = this.sortStore.sortRatingData$;
    this.sortTicketCount$ = this.sortStore.sortTicketCountData$;
    this.searchTerm$ = this.sortStore.searchQuery$;
  }

  ngOnInit(): void {
    this.subscription = this.searchResults$.subscribe(results => this.dataSource = new MatTableDataSource(results));
    this.ratingSort.valueChanges.subscribe(next => this.sortStore.setRatingSelected(next));
    this.ticketCountSort.valueChanges.subscribe(next => this.sortStore.setTicketCountSelected(next));

    // this.sortStore.searchQuery$.pipe(take(1)).subscribe(criterta => {
    //   this.searchTerm.patchValue(criteria.ticket , { emitEvent : false });
    //   this.assignedToUser.patIhValue(criteria.user, { emitEvent: false });
    // });

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

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge, Observable, of, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SearchFacade } from '../../services/search-facade';
import { MatTableDataSource } from '@angular/material/table';
import { DiscountSortsStore } from '../../services/discount-sorts-store';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}

export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {
  }

  getRepoIssues(sort: string, order: string, page: number): Observable<GithubApi> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl =
      `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;

    return this._httpClient.get<GithubApi>(requestUrl);
  }
}

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

  exampleDatabase: ExampleHttpDatabase | null;
  data;
  // displayedColumns: string[] = ['created', 'state', 'number', 'title'];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchTerm$: any;

  constructor(
    private facade: SearchFacade,
    private sortStore: DiscountSortsStore,
    private _httpClient: HttpClient
  ) {
    // this.sortRating$ = this.sortStore.sortRatingData$;
    // this.sortTicketCount$ = this.sortStore.sortTicketCountData$;
    // this.searchTerm$ = this.sortStore.searchQuery$;
  }

  ngOnInit(): void {
    this.subscription = this.searchResults$.subscribe(results => this.dataSource = new MatTableDataSource(results));
    this.ratingSort.valueChanges.subscribe(next => this.sortStore.setRatingSelected(next));
    this.ticketCountSort.valueChanges.subscribe(next => this.sortStore.setTicketCountSelected(next));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // console.log(this.sort);
    // this.sort.sortChange.subscribe(next => console.log(next));
    // this.paginator.page.subscribe(next => this.sortStore.setTake(next.pageSize));
    // this.paginator.page.subscribe(next => console.log(next));
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(
      // startWith({}),
          tap(x => console.log('x', x)),
          map(x => {
            return console.log(x);
          })
          // switchMap((pro) => {
          //   this.isLoadingResults = true;
          //   return console.log(pro);
            // return this.exampleDatabase!.getRepoIssues(
            //   this.sort.active, this.sort.direction, this.paginator.pageIndex);
          // })
    ).subscribe(data => this.data = data);

    // this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);
    //
    // // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    //
    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       return this.exampleDatabase!.getRepoIssues(
    //         this.sort.active, this.sort.direction, this.paginator.pageIndex);
    //     }),
    //     map(data => {
    //       // Flip flag to show that loading has finished.
    //       this.isLoadingResults = false;
    //       this.isRateLimitReached = false;
    //       this.resultsLength = data.total_count;
    //
    //       return data.items;
    //     }),
    //     catchError(() => {
    //       this.isLoadingResults = false;
    //       // Catch if the GitHub API has reached its rate limit. Return empty data.
    //       this.isRateLimitReached = true;
    //       return of([]);
    //     })
    //   ).subscribe(data => this.data = data);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchTermChange(query): void {
    console.log('query', query);
    this.sortStore.setSearchQuery(query);
  }
}

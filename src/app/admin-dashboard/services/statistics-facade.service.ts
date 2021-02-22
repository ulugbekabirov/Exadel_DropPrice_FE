import { Injectable } from '@angular/core';
import { VendorsService } from '../../services/vendors.service';
import { DiscountsService } from '../../services/discounts.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, pluck, startWith, switchMap, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { DiscountsSortStore } from './discounts-sorts-store';
import { VendorsSortStore } from './vendors-sort-store';


interface SearchResult {
  result: {};
}

class SearchState {
  results: SearchResult[];
  total: number;
}

@Injectable()
export class StatisticsFacadeService {

  private state = new SearchState();
  private dispatch = new BehaviorSubject<SearchState>(this.state);

  statisticStore$: Observable<SearchState> = this.dispatch.asObservable().pipe(
    distinctUntilChanged(),
    map(state => state),
  );

  constructor(
    private vendorsService: VendorsService,
    private discountsService: DiscountsService,
    private vendorsSortStore: VendorsSortStore,
    private discountsSortStore: DiscountsSortStore,
  ) {
  }

  searchDiscounts(
    debounceMs = 500
  ): any {
    const searchTerm$ = this.discountsSortStore.select('searchQuery')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
      );
    const sortBy$ = this.discountsSortStore.select('sortBy')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
      );
    const take$ = this.discountsSortStore.select('take')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged()
      );
    const skip$ = this.discountsSortStore.select('skip')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
      );
    return combineLatest(searchTerm$, sortBy$, take$, skip$)
      .pipe(
        switchMap(([searchQuery, sortBy, take, skip]) => {
          return this.discountsService.searchStatsDiscount({searchQuery, sortBy, take, skip})
            .pipe(
              tap(({totalNumberOfDiscounts, discountDTOs}) => {
                this.set('total', totalNumberOfDiscounts);
                this.set('results', discountDTOs);
                console.log(discountDTOs);
              })
            );
        })
      );
  }

  searchVendors(
    debounceMs = 500
  ): Observable<SearchResult[]> {
    const searchTerm$ = this.vendorsSortStore.select('searchQuery').pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
    );
    const sortBy$ = combineLatest(this.vendorsSortStore.select('ratingSelected'), this.vendorsSortStore.select('ticketCountSelected')).pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
    );
    const take$ = this.vendorsSortStore.select('take').pipe(
      debounceTime(debounceMs),
      distinctUntilChanged()
    );
    const skip$ = this.vendorsSortStore.select('skip').pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
    );

    combineLatest(searchTerm$, sortBy$, take$, skip$).pipe(
      switchMap(([searchQuery, sortBy, take, skip]) => {
        return this.vendorsService.searchVendors({searchQuery, sortBy, take, skip}).pipe(
          // tap(({totalNumberOfVendors}) => this.vendorsSortStore.set('totalNumberOfVendors', totalNumberOfVendors)),
          pluck('vendorDTOs'),
        );
      })
    )
      .subscribe(this.updateSearchResults.bind(this));
    return this.statisticStore$;
  }

  updateSearchResults(total: number, results: SearchResult[]): void {
    this.dispatch.next(
      (this.state = {
        ...this.state,
        results,
        total
      })
    );
    console.log(this.state);
  }

  updateDiscountsSort({pageSize, pageIndex, active, direction}): void {
    if (pageSize) {
      this.discountsSortStore.set('skip', pageSize * pageIndex);
      this.discountsSortStore.set('take', pageSize);
    }
    if (active) {
      let {sorts, sortBy} = this.discountsSortStore.value;
      let [primarySort, secondarySort] = sortBy;
      console.log(sortBy);
      if (!direction) {
        sortBy = [primarySort, secondarySort] = [secondarySort, primarySort];
        console.log(sortBy);
      } else {
        // const newSort = [...sorts]
        //   .filter(el => el.toLowerCase().includes(active.toLowerCase()) && el.toLowerCase().includes(direction.toLowerCase()));
        // primarySort = [...newSort];
        // console.log(primarySort);
        // console.log(sortBy);
      }
      // if (direction) {
      //   const newSort = [...sorts]
      //     .filter(el => el.toLowerCase().includes(active.toLowerCase()) && el.toLowerCase().includes(direction.toLowerCase()));
      //   console.log(newSort);
      //   console.log(sortBy);
      //   const newSortBy = [...newSort, sortBy[0]];
      //   console.log(newSortBy);
      // }
    }
  }

  get value(): any {
    return this.dispatch.value;
  }

  select<T>(name: string): Observable<T> {
    return this.statisticStore$.pipe(pluck(name));
  }

  set(name: string, state: any): void {
    this.dispatch.next({
      ...this.value, [name]: state
    });
    console.log(this.value);
  }
}

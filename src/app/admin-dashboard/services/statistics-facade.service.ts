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
}

@Injectable()
export class StatisticsFacadeService {

  private state = new SearchState();
  private dispatch = new BehaviorSubject<SearchState>(this.state);

  searchResults$: Observable<SearchResult[]> = this.dispatch.asObservable().pipe(
    map(state => state.results),
    startWith([] as SearchResult[])
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
  ): Observable<SearchResult[]> {
    const searchTerm$ = this.discountsSortStore.select('searchQuery').pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
    );
    const sortBy$ = combineLatest(
      this.discountsSortStore.select('ratingSelected'),
      this.discountsSortStore.select('ticketCountSelected')
    ).pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
    );
    const take$ = this.discountsSortStore.select('take').pipe(
      debounceTime(debounceMs),
      distinctUntilChanged()
    );
    const skip$ = this.discountsSortStore.select('skip').pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
    );
    combineLatest(searchTerm$, sortBy$, take$, skip$).pipe(
      switchMap(([searchQuery, sortBy, take, skip]) => {
        return this.discountsService.searchStatsDiscount({searchQuery, sortBy, take, skip}).pipe(
          pluck('discountDTOs'),
          tap(x => console.log('Discounts', x))
        );
      })
    ).subscribe(this.updateSearchResults.bind(this));
    return this.searchResults$;
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
          tap(x => console.log('Vendors', x)),
        );
      })
    )
      .subscribe(this.updateSearchResults.bind(this));
    return this.searchResults$;
  }

  updateSearchResults(results: SearchResult[]): void {
    this.dispatch.next(
      (this.state = {
        ...this.state,
        results
      })
    );
  }
}

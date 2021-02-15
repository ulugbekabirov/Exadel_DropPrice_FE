import { Injectable } from '@angular/core';
import { VendorsService } from '../../services/vendors.service';
import { DiscountsService } from '../../services/discounts.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Vendor } from '../../models';
import { SortStore } from './sort-store';
import { DiscountSortsStore } from './discount-sorts-store';


export interface SearchCriteria {
  searchQuery: string;
  sortBy: string[];
  skip: number;
  take: number;
}

interface SearchResult {
  vendors: Vendor;
}

class SearchState {
  vendors: SearchResult[];
  criteria: SearchCriteria = {
    searchQuery: '',
    sortBy: [],
    take: 10,
    skip: 0,
  };
}

@Injectable()
export class SearchFacade {

  private state = new SearchState();
  private dispatch = new BehaviorSubject<SearchState>(this.state);

  searchResults$: Observable<SearchResult[]> = this.dispatch.asObservable().pipe(
    map(state => state.vendors),
    startWith([] as SearchResult[])
  );
  searchCriteria$: Observable<SearchCriteria> = this.dispatch.asObservable().pipe(
    map(state => state.criteria)
  );

  constructor(
    private vendorsService: VendorsService,
    private discountsService: DiscountsService,
    private sortStore: SortStore,
    private discountStoreSort: DiscountSortsStore,
  ) {
  }

  updateCriteria(searchQuery: string, sortBy: string[], take: number, skip: number): void {
    const criteria = {...this.state.criteria, searchQuery, sortBy, skip, take};
    this.dispatch.next(
      (this.state = {
        ...this.state,
        criteria
      })
    );
  }

  searchDiscounts(
    debounceMs = 500
  ): Observable<SearchResult[]> {

    const criteria = this.state.criteria;

    const searchTerm$ = this.discountStoreSort.searchQuery$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      tap(x => console.log('dfrdfvfcv', x))
    );
    const sortBy$ = combineLatest(this.discountStoreSort.sortRatingSelected$, this.discountStoreSort.sortTicketCountSelected$).pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
    );
    const take$ = this.discountStoreSort.take$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged()
    );
    const skip$ = this.discountStoreSort.skip$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
    );

    combineLatest(searchTerm$, sortBy$, take$, skip$).pipe(
      switchMap(([searchQuery, sortBy, take, skip]) => {
        console.log('jfcdjcdcd', sortBy);
        // this.updateCriteria(searchTerm, sortBy, take, skip);
        // const hasCriteria = searchTerm.length || sortBy.length;
        // return !hasCriteria ? of([]) : this.vendorsService.searchVendors({searchTerm, sortBy, take, skip}).pipe(
        return this.discountsService.searchStatsDiscount({searchQuery, sortBy, take, skip}).pipe(
          // return this.discountsService.searchStatsDoscount({searchQuery, sortBy, take, skip}).pipe(
          tap(x => console.log('xxxx', x))
        );
      })
    )
      .subscribe(this.updateVendors.bind(this));
    return this.searchResults$;
  }



  searchVendors(
    debounceMs = 500
  ): Observable<SearchResult[]> {

    const criteria = this.state.criteria;

    const searchTerm$ = this.sortStore.searchQuery$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      tap(x => console.log('dfrdfvfcv', x))
    );
    const sortBy$ = combineLatest(this.sortStore.sortRatingSelected$, this.sortStore.sortTicketCountSelected$).pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
    );
    const take$ = this.sortStore.take$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged()
    );
    const skip$ = this.sortStore.skip$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
    );

    combineLatest(searchTerm$, sortBy$, take$, skip$).pipe(
      switchMap(([searchQuery, sortBy, take, skip]) => {
        console.log('jfcdjcdcd', sortBy)
        // this.updateCriteria(searchTerm, sortBy, take, skip);
        // const hasCriteria = searchTerm.length || sortBy.length;
        // return !hasCriteria ? of([]) : this.vendorsService.searchVendors({searchTerm, sortBy, take, skip}).pipe(
        return this.vendorsService.searchVendors({searchQuery, sortBy, take, skip}).pipe(
        // return this.discountsService.searchStatsDoscount({searchQuery, sortBy, take, skip}).pipe(
          tap(x => console.log('xxxx', x))
        );
      })
    )
      .subscribe(this.updateVendors.bind(this));
    return this.searchResults$;
  }

  updateVendors(vendors: SearchResult[]): void {
    this.dispatch.next(
      (this.state = {
        ...this.state,
        vendors
      })
    );
  }

}

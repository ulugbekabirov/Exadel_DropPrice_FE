import { Injectable } from '@angular/core';
import { VendorsService } from '../../services/vendors.service';
import { DiscountsService } from '../../services/discounts.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Vendor } from '../../models';


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
export class SearchFacadeService {

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
  ) {}

  updateCriteria(searchQuery: string, sortBy: string[], take: number, skip: number): void {
    const criteria = {...this.state.criteria, searchQuery, sortBy, skip, take};
    this.dispatch.next(
      (this.state = {
        ...this.state,
        criteria
      })
    );
  }

  searchVendors(
    searchTerm$: Observable<any>,
    sortBy$: Observable<any>,
    take$: Observable<any>,
    skip$: Observable<any>,
    debounceMs = 500
  ): Observable<SearchResult[]> {

    const criteria = this.state.criteria;

    searchTerm$ = searchTerm$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      startWith(criteria.searchQuery));
    sortBy$ = sortBy$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      startWith(criteria.sortBy));
    take$ = take$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      startWith(criteria.take));
    skip$ = skip$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      startWith(criteria.skip));

    combineLatest(searchTerm$, sortBy$, take$, skip$).pipe(
      switchMap(([searchTerm, sortBy, take, skip]) => {
        this.updateCriteria(searchTerm, sortBy, take, skip);
        const hasCriteria = searchTerm.length || sortBy.length;
        return !hasCriteria ? of([]) : this.vendorsService.searchVendors({searchTerm, sortBy, take, skip,});
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

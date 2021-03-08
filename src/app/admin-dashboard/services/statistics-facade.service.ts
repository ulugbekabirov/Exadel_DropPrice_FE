import { Injectable } from '@angular/core';
import { VendorsService } from '../../services/vendors/vendors.service';
import { DiscountsService } from '../../services/discounts/discounts.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { DiscountsStatStore } from './discounts-stat-store';
import { VendorsStatStore } from './vendors-stat-store';

@Injectable()
export class StatisticsFacadeService {
  constructor(
    private vendorsService: VendorsService,
    private discountsService: DiscountsService,
    private vendorsStatStore: VendorsStatStore,
    private discountsStatStore: DiscountsStatStore,
  ) {
  }

  searchDiscounts(debounceMs = 500): Observable<any> {
    const searchTerm$ = this.discountsStatStore.select('searchQuery')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
      );
    const sortBy$ = this.discountsStatStore.select('sortBy')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
      );
    const take$ = this.discountsStatStore.select('take')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged()
      );
    const skip$ = this.discountsStatStore.select('skip')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
      );
    return combineLatest(searchTerm$, sortBy$, take$, skip$)
      .pipe(
        switchMap(([searchQuery, sortBy, take, skip]) => {
          return this.discountsService.searchStatsDiscounts({searchQuery, sortBy, take, skip})
            .pipe(
              tap(({totalNumberOfDiscounts, discountDTOs}) => {
                this.discountsStatStore.set('total', totalNumberOfDiscounts);
                this.discountsStatStore.set('results', discountDTOs);
              })
            );
        })
      );
  }

  searchVendors(debounceMs = 500): Observable<any> {
    const searchTerm$ = this.vendorsStatStore.select('searchQuery')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
      );
    const sortBy$ = this.vendorsStatStore.select('sortBy')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
      );
    const take$ = this.vendorsStatStore.select('take')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged()
      );
    const skip$ = this.vendorsStatStore.select('skip')
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
      );

    return combineLatest(searchTerm$, sortBy$, take$, skip$).pipe(
      switchMap(([searchQuery, sortBy, take, skip]) => {
        return this.vendorsService.searchStatsVendors({searchQuery, sortBy, take, skip})
          .pipe(
            tap(({totalNumberOfVendors, vendorDTOs}) => {
              this.vendorsStatStore.set('total', totalNumberOfVendors);
              this.vendorsStatStore.set('results', vendorDTOs);
            })
          );
      })
    );
  }

  updateDiscountsSort({pageSize, pageIndex, active, direction}): void {
    if (pageSize) {
      this.discountsStatStore.set('skip', pageSize * pageIndex);
      this.discountsStatStore.set('take', pageSize);
    }
    if (active) {
      const {sorts, sortBy} = this.discountsStatStore.value;
      const [primarySort, secondarySort] = sortBy;
      if (direction) {
        const newSort = [...sorts]
          .filter(el => el.toLowerCase().includes(active.toLowerCase()) && el.toLowerCase().includes(direction.toLowerCase()));
        const newSortBy = [...newSort, primarySort.toLowerCase().includes(active.toLowerCase()) ? secondarySort : primarySort];
        this.discountsStatStore.set('sortBy', newSortBy);
      }
    }
  }

  updateVendorsSort({pageSize, pageIndex, active, direction}): void {
    if (pageSize) {
      this.vendorsStatStore.set('skip', pageSize * pageIndex);
      this.vendorsStatStore.set('take', pageSize);
    }
    if (active) {
      const {sorts, sortBy} = this.vendorsStatStore.value;
      const [primarySort, secondarySort] = sortBy;
      if (direction) {
        const newSort = [...sorts]
          .filter(el => el.toLowerCase().includes(active.toLowerCase()) && el.toLowerCase().includes(direction.toLowerCase()));
        const newSortBy = [...newSort, primarySort.toLowerCase().includes(active.toLowerCase()) ? secondarySort : primarySort];
        this.vendorsStatStore.set('sortBy', newSortBy);
      }
    }
  }

}

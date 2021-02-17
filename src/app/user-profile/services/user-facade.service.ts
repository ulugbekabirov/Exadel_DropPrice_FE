import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, pluck, startWith, switchMap, tap } from 'rxjs/operators';
import { Discount, Ticket } from '../../models';
import { DiscountsService } from '../../services/discounts.service';

class UserProfileState {
  discounts: Discount[];
  tickets: Ticket[];
  // isSavedIds: number[];
  // isSavedTake: number;
  // isSavedSkip: number;
  // isOrderedIds: number[];
  // isOrderedTake: number;
  // isOrderedSkip: number;
}

const INITIAL_STATE: UserProfileState = {
  discounts: [],
  tickets: []
  // isOrderedIds: [],
  // isSavedIds: [],
  // isSavedTake: 10,
  // isSavedSkip: 0,
  // isOrderedTake: 5,
  // isOrderedSkip: 0,
};

@Injectable()
export class UserFacadeService {
  private state = new UserProfileState();
  private subject = new BehaviorSubject<UserProfileState>(INITIAL_STATE);

  userProfileStore$ = this.subject.asObservable().pipe(
    distinctUntilChanged(),
    map(state => state),
    // startWith([] as Discount[])
  );

  constructor(
    private discountsService: DiscountsService,
  ) {
  }

  getUserSavedDiscounts(debounceMs = 500): any {
    // const skip$ = this.select('isSavedSkip');
    const skip$ = of(0);
    // const take$ = this.select('isSavedTake');
    const take$ = of(10);
    const latitude$ = of(0);
    const longitude$ = of(0);

    combineLatest(skip$, take$, latitude$, longitude$).pipe(
      switchMap(([skip, take]) => {
        return this.discountsService.getUserSavedDiscounts({skip, take}).pipe(
          tap(x => console.log('savedDiscounts', x))
        );
      })
    ).subscribe(this.updateSavedUserDiscounts.bind(this));
    return this.userProfileStore$;
  }

  getUserOrderedDiscounts(debounceMs = 500): any {
    const skip$ = of(0);
    const take$ = of(10);
    const latitude$ = of(0);
    const longitude$ = of(0);

    combineLatest(skip$, take$, latitude$, longitude$).pipe(
      switchMap(([skip, take, latitude, longitude]) => {
        return this.discountsService.getUserOrderedDiscounts({skip, take}).pipe(
          tap(x => console.log('tickets', x))
        );
      })
    ).subscribe(this.updateOrderedUserDiscounts.bind(this));
    return this.userProfileStore$;
  }


  updateSearchResults(discounts): void {
    this.subject.next(
      (this.state = {
        ...this.state,
        discounts
      })
    );
    console.log(this.subject.value)
  }

  updateSavedUserDiscounts(data): void {
    this.set('discounts', data);
    // this.set('isSavedIds', data.map(discount => discount.discountId));
  }

  updateOrderedUserDiscounts(data): void {
    this.set('tickets', data);
    // this.set('isOrderedIds', data.map(discount => discount.discountId));
  }

  get value(): UserProfileState {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.userProfileStore$.pipe(pluck(name));
  }

  set(name: string, state: any): void {
    this.subject.next({
      ...this.value, [name]: state
    });
  }

}

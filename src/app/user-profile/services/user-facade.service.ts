import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, pluck, switchMap } from 'rxjs/operators';
import { Discount, Ticket } from '../../models';
import { DiscountsService } from '../../services/discounts.service';

class UserProfileState {
  discounts: Discount[];
  tickets: Ticket[];
}

const INITIAL_STATE: UserProfileState = {
  discounts: [],
  tickets: []
};

@Injectable()
export class UserFacadeService {
  private state = new UserProfileState();
  private subject = new BehaviorSubject<UserProfileState>(INITIAL_STATE);

  userProfileStore$ = this.subject.asObservable().pipe(
    distinctUntilChanged(),
    map(state => state),
  );

  constructor(
    private discountsService: DiscountsService,
  ) {
  }

  getUserSavedDiscounts(debounceMs = 500): any {
    const skip$ = of(0);
    const take$ = of(10);

    combineLatest(skip$, take$).pipe(
      switchMap(([skip, take]) => {
        return this.discountsService.getUserSavedDiscounts({skip, take}).pipe(
        );
      })
    ).subscribe(this.updateSavedUserDiscounts.bind(this));
    return this.userProfileStore$;
  }

  getUserOrderedDiscounts(debounceMs = 500): any {
    const skip$ = of(0);
    const take$ = of(10);
    combineLatest(skip$, take$).pipe(
      switchMap(([skip, take]) => {
        return this.discountsService.getUserOrderedDiscounts({skip, take}).pipe(
        );
      })
    ).subscribe(this.updateOrderedUserDiscounts.bind(this));
    return this.userProfileStore$;
  }

  updateSavedUserDiscounts(data): void {
    this.set('discounts', data);
  }

  updateOrderedUserDiscounts(data): void {
    this.set('tickets', data);
  }

  toggleFavoriteDiscount(discountId): void {
    this.discountsService.updateIsSavedDiscount(discountId).pipe(
    ).subscribe(resp => {
      const value = this.subject.value.discounts;
      const discounts = value.filter((discount: Discount) => discount.discountId !== resp.discountID);
      this.updateSavedUserDiscounts(discounts);
    });
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
    console.log('VALUE', this.subject.value);
  }

}

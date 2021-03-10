import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, pluck, switchMap } from 'rxjs/operators';
import { Discount, Ticket } from '../../models';
import { DiscountsService } from '../../services/discounts/discounts.service';
import { TicketService } from '../../services/ticket/ticket.service';
import { ApiDataService } from '../../services/api-data/api-data.service';

class UserProfileState {
  discounts: Discount[];
  tickets: Ticket[];
}

const INITIAL_STATE: UserProfileState = {
  discounts: [],
  tickets: [],
};

@Injectable({
  providedIn: 'root'
})
export class UserFacadeService {
  private state = new UserProfileState();
  private subject = new BehaviorSubject<UserProfileState>(INITIAL_STATE);

  userProfileStore$ = this.subject.asObservable().pipe(
    distinctUntilChanged(),
    map(state => state),
  );

  constructor(
    private discountsService: DiscountsService,
    private ticketService: TicketService,
    private restApi: ApiDataService,
  ) {
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

  getUserSavedDiscounts(debounceMs = 500): any {
    const skip$ = of(0);
    const take$ = of(50);

    combineLatest(skip$, take$).pipe(
      switchMap(([skip, take]) => {
        return this.discountsService.getUserSavedDiscounts({skip, take}).pipe(
          map(discounts => {
            return discounts.map(discount => {
              const {endDate, startDate} = discount;
              const dateNow = Date.now();
              const discountAvailable = (dateNow > new Date(startDate).getTime() && dateNow < new Date(endDate).getTime());
              return {...discount, discountAvailable};
            });
          }),
        );
      })
    ).subscribe(this.updateSavedUserDiscounts.bind(this));
    return this.userProfileStore$;
  }

  getUserOrderedDiscounts(debounceMs = 500): any {
    const skip$ = of(0);
    const take$ = of(50);
    combineLatest(skip$, take$).pipe(
      switchMap(([skip, take]) => {
        return this.discountsService.getUserOrderedDiscounts({skip, take}).pipe(
          map(tickets => {
            return tickets.map(ticket => {
              const {discountStartDate, discountEndDate} = ticket;
              const dateNow = Date.now();
              const discountAvailable = (dateNow > new Date(discountStartDate).getTime() && dateNow < new Date(discountEndDate).getTime());
              return {...ticket, discountAvailable};
            });
          }),
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
      this.getUserSavedDiscounts();
      this.getUserOrderedDiscounts();
    });
  }

  orderTicket(discountId, ref): void {
    this.restApi.getTicket(discountId).pipe(
    ).subscribe(ticket => {
      this.ticketService.createTicket(ticket, ref);
      this.getUserOrderedDiscounts();
    });
  }

}

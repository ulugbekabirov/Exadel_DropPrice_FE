import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ActiveUser, Discount, Ticket } from '../../../models';
import { UserService } from '../../../services/user.service';
import { UserFacadeService } from '../../services/user-facade.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  activeUser: ActiveUser;
  orders;
  discounts;
  isSavedDiscounts$: Observable<Discount[]> = this.facade.getUserSavedDiscounts();
  orderedTickets$: Observable<Ticket[]> = this.facade.getUserOrderedDiscounts();

  constructor(
    private userService: UserService,
    private facade: UserFacadeService
  ) {
    // this.orderedTickets$ = this.facade.getUserOrderedDiscounts();
    // this.isSavedDiscounts$ = this.facade.getUserSavedDiscounts();
  }

  ngOnInit(): void {
    this.subscription = this.userService.activeUser
      .subscribe(data => this.activeUser = data);
    this.orders = this.facade.select('tickets');
    this.discounts = this.facade.select('discounts');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ActiveUser, Discount, Ticket } from '../../../models';
import { UserService } from '../../../services/user.service';
import { UserFacadeService } from '../../services/user-facade.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { TicketService } from '../../../services/ticket.service';
import { RefDirective } from '../../../directives/ref.directive';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  activeUser$: Observable<ActiveUser>;
  // isSavedDiscounts$: Observable<Discount[]>;
  // orderedTickets$: Observable<Ticket[]>;
  orders$: Observable<Ticket[]>;
  discounts$: Observable<Discount[]>;

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private userService: UserService,
    private ticketService: TicketService,
    private facade: UserFacadeService,
  ) {
    this.facade.getUserOrderedDiscounts();
    this.facade.getUserSavedDiscounts();
  }

  ngOnInit(): void {
    this.activeUser$ = this.userService.activeUser;
    this.orders$ = this.facade.select('tickets');
    this.discounts$ = this.facade.select('discounts');
  }

  getTicket(discountId: number): void {
    this.ticketService.getTicket(discountId, this.refDir);
  }

  changeFavourites(discountId: number): void {
    this.facade.toggleFavoriteDiscount(discountId);
  }

  ngOnDestroy(): void {
  }
}

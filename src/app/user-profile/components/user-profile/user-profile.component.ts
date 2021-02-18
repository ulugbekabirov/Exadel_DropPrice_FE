import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ActiveUser, Discount, Ticket } from '../../../models';
import { UserService } from '../../../services/user.service';
import { UserFacadeService } from '../../services/user-facade.service';
import { TicketService } from '../../../services/ticket.service';
import { RefDirective } from '../../../directives/ref.directive';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserProfileComponent implements OnInit {
  activeUser$: Observable<ActiveUser>;
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
    this.facade.orderTicket(discountId, this.refDir);
  }

  changeFavourites(discountId: number): void {
    this.facade.toggleFavoriteDiscount(discountId);
  }
}

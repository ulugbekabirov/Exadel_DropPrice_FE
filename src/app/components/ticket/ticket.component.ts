import { Component, ComponentFactoryResolver, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Ticket } from '../../models';
import { DiscountsService } from '../../services/discounts.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})

export class TicketComponent implements OnInit, OnDestroy {

  // ticket: Ticket = {
  //   firstName: 'Иванов',
  //   lastName: 'Иван',
  //   patronymic: 'Иванович',
  //   nameDiscount: 'Кроссовки',
  //   nameVendor: 'Спортмастер',
  //   email: 'sm@gmail.com',
  //   phone: '+375(29)111-11-11',
  //   discountAmount: 30,
  //   endDate: new Date(),
  //   promoCode: 'Бинго'
  // };

  private subscription: Subscription;

  @Output() closeTicket = new EventEmitter<boolean>();
  @Input() ticket$: Observable<Ticket>;
  @Input() ticket: Ticket;

  constructor(
    private discountsService: DiscountsService,
  ) {
  }

  ngOnInit(): void {
    console.log('ttttt', this.ticket$);
  }

  back(): void {
    this.closeTicket.emit(true);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

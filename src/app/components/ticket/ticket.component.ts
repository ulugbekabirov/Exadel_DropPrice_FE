import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})

export class TicketComponent {

  ticket: Ticket = {
    firstName: 'Иванов',
    lastName: 'Иван',
    patronymic: 'Иванович',
    nameDiscount: 'Кроссовки',
    nameVendor: 'Спортмастер',
    email: 'sm@gmail.com',
    phone: '+375(29)111-11-11',
    discountAmount: 30,
    endDate: new Date (),
    promoCode:  'Бинго'
  };

  constructor(private location: Location) {
  }

  back(): void {
    this.location.back();
  }
}

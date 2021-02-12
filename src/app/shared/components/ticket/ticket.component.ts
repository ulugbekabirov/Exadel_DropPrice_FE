import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../../../models';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})

export class TicketComponent {

  @Output() closeTicket = new EventEmitter<boolean>();
  @Input() ticket: Ticket;

  back(): void {
    this.closeTicket.emit(true);
  }
}

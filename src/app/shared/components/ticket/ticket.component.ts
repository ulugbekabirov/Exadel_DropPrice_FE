import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TicketComponent {

  @Output() closeTicket = new EventEmitter<boolean>();
  @Input() ticket;

  back(): void {
    this.closeTicket.emit(true);
  }
}

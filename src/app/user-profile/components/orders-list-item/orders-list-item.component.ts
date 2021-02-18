import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../../../models';

@Component({
  selector: 'app-orders-list-item',
  templateUrl: './orders-list-item.component.html',
  styleUrls: ['./orders-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class OrdersListItemComponent {
  @Input() ticket: Ticket;
  @Output() requestTicket = new EventEmitter<any>();
  @Output() changeFavourites = new EventEmitter<any>();

  ticketHandler(discountId: number): void {
    this.requestTicket.emit(discountId);
  }

  toggleFavorites(discountId: number): void {
    this.changeFavourites.emit(discountId);
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Discount } from '../../../models';

@Component({
  selector: 'app-saved-list-item',
  templateUrl: './saved-list-item.component.html',
  styleUrls: ['./saved-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SavedListItemComponent {
  @Input() discount: Discount;
  @Output() requestTicket = new EventEmitter<any>();
  @Output() changeFavourites = new EventEmitter<any>();

  ticketHandler(discountId: number): void {
    this.requestTicket.emit(discountId);
  }

  toggleFavorites(discountId: number): void {
    this.changeFavourites.emit(discountId);
  }
}

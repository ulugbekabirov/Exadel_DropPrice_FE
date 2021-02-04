import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { Discount } from '../../../models';

@Component({
  selector: 'app-discounts-list-item',
  templateUrl: './discounts-list-item.component.html',
  styleUrls: ['./discounts-list-item.component.scss']
})
export class DiscountsListItemComponent {
  @Input() discount: Discount;

  addToFavorites(): void {
  }

  ticketHandler(): void {
    alert('haven\'t done yet'); // ...
  }
}

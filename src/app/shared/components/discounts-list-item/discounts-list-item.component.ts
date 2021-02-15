import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Discount } from '../../../models';

import { Router } from '@angular/router';

import { TestService } from './../../../test.service';

@Component({
  selector: 'app-discounts-list-item',
  templateUrl: './discounts-list-item.component.html',
  styleUrls: ['./discounts-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountsListItemComponent {

  constructor(private _router: Router, private testService: TestService){}
  @Input() discount: Discount;
  @Output() requestTicket = new EventEmitter<any>();
  @Output() changeFavourites = new EventEmitter<any>();

  ticketHandler(discountId: number): void {
    this.requestTicket.emit(discountId);
  }

  toggleFavorites(discountId: number): void {
    this.changeFavourites.emit(discountId);
  }
  onEditDiscount(discountId: number){
    this._router.navigate(['discounts/edit', discountId])
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Discount, LocationCoords, Town } from '../../../models';

@Component({
  selector: 'app-discounts-list',
  templateUrl: './discounts-list.component.html',
  styleUrls: ['./discounts-list.component.scss']
})
export class DiscountsListComponent {
  @Output() locationChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  @Output() getTicket = new EventEmitter<any>();
  @Input() discounts: Discount[];
  @Input() towns: Town[];
  @Input() activeCoords: LocationCoords;
  @Input() sortBy;

  selectLocation(loc): void {
    this.locationChange.emit(loc);
  }

  selectSort(sortBy): void {
    this.sortChange.emit(sortBy);
  }

  requestTicket(discountId: any): void {
    this.getTicket.emit(discountId);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActiveUser, Discount, Town } from '../../../models';

@Component({
  selector: 'app-discounts-list',
  templateUrl: './discounts-list.component.html',
  styleUrls: ['./discounts-list.component.scss']
})
export class DiscountsListComponent {
  @Input() discounts: Discount[];
  @Output() locationChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  @Input() towns: Town[];
  @Input() activeUser: ActiveUser;
  @Input() sortBy;

  selectLocation(loc): void {
    this.locationChange.emit(loc);
  }

  selectSort(sortBy): void {
    this.sortChange.emit(sortBy);
  }
}

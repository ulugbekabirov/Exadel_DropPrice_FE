import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Discount, LocationCoords, Town } from '../../../models';

@Component({
  selector: 'app-discounts-list',
  templateUrl: './discounts-list.component.html',
  styleUrls: ['./discounts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DiscountsListComponent {
  @Output() locationChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  @Output() getTicket = new EventEmitter<any>();
  @Output() toggleFavourites = new EventEmitter<any>();
  @Output() toggleCoordinates = new EventEmitter<any>();
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

  getToggleFavourites(id: number): void {
    this.toggleFavourites.emit(id);
  }

  myCoords($event: MouseEvent): void {
    this.toggleCoordinates.emit($event);
  }
}

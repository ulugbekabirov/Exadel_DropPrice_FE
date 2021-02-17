import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Discount, LocationCoords, Ticket, Town } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent {
  @Output() locationChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  @Output() getTicket = new EventEmitter<any>();
  @Output() toggleFavourites = new EventEmitter<any>();
  @Output() toggleCoordinates = new EventEmitter<any>();
  @Input() tickets$;
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

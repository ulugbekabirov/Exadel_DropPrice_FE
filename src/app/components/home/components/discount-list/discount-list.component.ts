import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActiveUser, Discount, Town } from '../../../../models';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.scss']
})
export class DiscountListComponent {
  sortSettings: string[] = ['alphabet', 'distance', 'vendor'];

  @Output() locationChange = new EventEmitter<any>();
  @Input() towns: Town[];
  @Input() discounts: Discount[];
  @Input() activeUser: ActiveUser;

  selectLocation(v: any): void {
    this.locationChange.emit({
      longitude: v.longitude,
      latitude: v.latitude,
    });
  }
}

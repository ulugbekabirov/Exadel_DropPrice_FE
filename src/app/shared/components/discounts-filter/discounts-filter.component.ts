import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-discounts-filter',
  templateUrl: './discounts-filter.component.html',
  styleUrls: ['./discounts-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DiscountsFilterComponent {

  @Input() sortBy: any;
  @Output() sortValueChange = new EventEmitter<any>();

  selectSort(value: any): void {
    this.sortValueChange.emit(value);
  }
}

import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PointOfSales } from '../../../models/point-of-sales';

@Component({
  selector: 'app-discounts-map',
  templateUrl: './discounts-map.component.html',
  styleUrls: ['./discounts-map.component.scss']
})
export class DiscountsMapComponent {
  @Input()
  pointsOfSales$: Observable<PointOfSales[]>;
  @Input()
  locationSelected$: Observable<any>;
  zoom = 7;

  clickedMarker(label: string, id: number): void {
  }
}

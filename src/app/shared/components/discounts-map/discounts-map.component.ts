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
  zoom: number = 7;

  clickedMarker(label: string, index: number): void {
    console.log(`clicked the marker: ${label || index}`);
  }

  max(coordType: 'latitude' | 'longitude'): number {
    this.pointsOfSales$.subscribe(markers => {
      return Math.max(...markers.map(marker => marker[coordType]));
    });
  }

  min(coordType: 'latitude' | 'longitude'): number {
    this.pointsOfSales$.subscribe(markers => {
      return Math.max(...markers.map(marker => marker[coordType]));
    });
  }
}

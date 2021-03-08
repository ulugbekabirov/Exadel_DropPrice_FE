import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PointOfSales } from '../../../models/point-of-sales';
import { UserService } from '../../../services/user/user.service';


@Component({
  selector: 'app-discounts-map',
  templateUrl: './discounts-map.component.html',
  styleUrls: ['./discounts-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DiscountsMapComponent {
  @Input()
  pointsOfSales$: Observable<PointOfSales[]>;
  @Input()
  locationSelected$: Observable<any>;
  zoom = 10;

  clickedMarker(label: string, id: number): void {
  }
}

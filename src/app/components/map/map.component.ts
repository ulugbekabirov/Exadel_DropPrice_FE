import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SalesCoordinate } from '../../models/sales-coordinate';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  zoom = 13;
  coordinate: SalesCoordinate = {
    latitude: 53.9,
    longitude: 27.5667,
  };

  constructor(
    private dialogRef: MatDialogRef<MapComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {}

  onChoseLocation(event): void {
    this.coordinate.latitude = event.coords.lat;
    this.coordinate.longitude = event.coords.lng;
  }
  getCoordinats(): void {
    this.coordinate = {
      latitude: this.coordinate.latitude,
      longitude: this.coordinate.longitude,
    };
    this.dialogRef.close(this.coordinate);
  }

  close() {
    this.dialogRef.close();
  }
}

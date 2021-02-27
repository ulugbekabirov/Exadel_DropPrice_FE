import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  zoom = 13;
  coordinates;
  subscription: Subscription;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<MapComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    if (data.latitude && data.longitude) {
      this.coordinates.latitude = data.latitude;
      this.coordinates.longitude = data.longitude;
    }
  }

  ngOnInit(): void {
    this.subscription = this.userService.activeUser$.pipe(
      map(({officeLongitude, officeLatitude}) => ({
        latitude: officeLatitude,
        longitude: officeLongitude
      }))
    ).subscribe(next => this.coordinates = next);
  }

  onChoseLocation(event): void {
    this.coordinates.latitude = event.coords.lat;
    this.coordinates.longitude = event.coords.lng;
  }

  getCoordinates(): void {
    this.dialogRef.close(this.coordinates);
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

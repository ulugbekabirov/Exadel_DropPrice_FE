import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Location } from '../../models/location';
import { GeocodeService } from '../../services/geocode/geocode.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  @Input()
  point: FormGroup;
  zoom = 14;
  coordinates = {
    latitude: null,
    longitude: null,
  };
  location: Location;
  private unsubscribe$ = new Subject<void>();


  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<MapComponent>,
    private geocodeService: GeocodeService,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    if (data.value.latitude && data.value.longitude) {
      this.coordinates.latitude = data.value.latitude;
      this.coordinates.longitude = data.value.longitude;
    }
    if (data.value.address) {
      this.addressToCoordinates(data.value.address);
    }
    this.point = data;
  }

  ngOnInit(): void {
    this.userService.activeUser$.pipe(
      map((user) => ({
        latitude: user.latitude ? user.latitude : user.officeLatitude,
        longitude: user.longitude ? user.longitude : user.officeLongitude,
      })),
      takeUntil(this.unsubscribe$)
    ).subscribe(coords => {
      if (this.coordinates.latitude && this.coordinates.longitude) {
        return;
      }
      this.coordinates = coords;
    });
  }

  onChoseLocation(event): void {
    this.geocodeService.geocodeAddressByCoordinates(event.coords.lat, event.coords.lng)
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(results => {
      this.applyCoordinates(results[0]);
    });
  }

  showLocation(): void {
    this.addressToCoordinates(this.point.value.address);
  }

  addressToCoordinates(value: string): void {
    this.geocodeService.geocodeAddress(value)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((results: Location) => {
          this.applyCoordinates(results[0]);
        }
      );
  }

  applyCoordinates(results): void {
    if (results) {
      this.zoom = 18;
      const point = {
        address: results.formatted_address,
        latitude: results.geometry.location.lat(),
        longitude: results.geometry.location.lng()
      };
      this.coordinates.latitude = point.latitude;
      this.coordinates.longitude = point.longitude;
      this.point.patchValue(point);
    }
    this.ref.detectChanges();
  }

  getCoordinates(): void {
    this.dialogRef.close(this.point.value);
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

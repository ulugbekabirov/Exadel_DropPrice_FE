import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { SalesCoordinate } from '../models/sales-coordinate';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Output() data: EventEmitter<any> = new EventEmitter<any>();
  zoom = 13;
  coordinate: SalesCoordinate = {
    latitude: 53.9,
    longitude: 27.5667,
  };

  coordinates: SalesCoordinate[] = [];
  constructor() {}
  ngOnInit() {}
  onChoseLocation(event) {
    this.coordinate.latitude = event.coords.lat;
    this.coordinate.longitude = event.coords.lng;
    console.log(event);
  }
  getCoordinats() {
    let latlng = {
      latitude: this.coordinate.latitude,
      longitude: this.coordinate.longitude,
    };
    this.coordinates.push(latlng);
    console.log(this.coordinates);
    this.data.emit(this.coordinates);
  }
}

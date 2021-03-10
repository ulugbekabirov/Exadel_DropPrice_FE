import { TestBed } from '@angular/core/testing';

import { GeocodeService } from './geocode.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GeocoderResult, GeocoderStatus, MapsAPILoader } from '@agm/core';

describe('GeocodeService', () => {
  let service: GeocodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        RouterTestingModule,
       ],
       providers: [MapsAPILoader]
    });
    service = TestBed.inject(GeocodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { VendorsService } from './vendors.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('VendorsService', () => {
  let service: VendorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
    });
    service = TestBed.inject(VendorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

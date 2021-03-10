import { TestBed } from '@angular/core/testing';

import { VendorsFacadeService } from './vendors-facade.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('VendorsFacadeService', () => {
  let service: VendorsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
    });
    service = TestBed.inject(VendorsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

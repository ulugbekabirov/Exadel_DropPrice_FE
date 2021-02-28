import { TestBed } from '@angular/core/testing';

import { VendorsFacadeService } from './vendors-facade.service';

describe('VendorsFacadeService', () => {
  let service: VendorsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { VendorsStore } from './vendors-store';

describe('VendorsStore', () => {
  let service: VendorsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

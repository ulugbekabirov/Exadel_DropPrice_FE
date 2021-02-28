import { TestBed } from '@angular/core/testing';

import { DiscountsStore } from './discounts-store';

describe('DiscountsStore', () => {
  let service: DiscountsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DiscountsFacadeService } from './discounts-facade.service';

describe('DiscountsFacadeService', () => {
  let service: DiscountsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

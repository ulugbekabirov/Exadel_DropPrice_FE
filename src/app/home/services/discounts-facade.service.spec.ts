import { TestBed } from '@angular/core/testing';

import { DiscountsFacadeService } from './discounts-facade.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DiscountsFacadeService', () => {
  let service: DiscountsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
    });
    service = TestBed.inject(DiscountsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

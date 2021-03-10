import { TestBed } from '@angular/core/testing';

import { DiscountsService } from './discounts.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DiscountsService', () => {
  let service: DiscountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
    });
    service = TestBed.inject(DiscountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

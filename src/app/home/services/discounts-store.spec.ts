import { TestBed } from '@angular/core/testing';

import { DiscountsStore } from './discounts-store';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('DiscountsStore', () => {
  let service: DiscountsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
    });
    service = TestBed.inject(DiscountsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

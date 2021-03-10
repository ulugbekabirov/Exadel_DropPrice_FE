import { VendorsRequestStore } from './vendors-request-store';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('VendorsRequestStore', () => {
  let service: VendorsRequestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
    });
    service = TestBed.inject(VendorsRequestStore);
  });

  it('should create an instance', () => {
    expect(new VendorsRequestStore()).toBeTruthy();
  });
});

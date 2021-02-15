import { TestBed } from '@angular/core/testing';

import { SortStore } from './sort-store';

describe('SortService', () => {
  let service: SortStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

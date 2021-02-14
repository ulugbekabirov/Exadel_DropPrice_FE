import { TestBed } from '@angular/core/testing';

import { SearchFacadeService } from './search-facade.service';

describe('SearchFacadeService', () => {
  let service: SearchFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

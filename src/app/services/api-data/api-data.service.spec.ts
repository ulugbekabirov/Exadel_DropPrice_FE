import { TestBed } from '@angular/core/testing';

import { ApiDataService } from './api-data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiDataService', () => {
  let service: ApiDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
    });
    service = TestBed.inject(ApiDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { StatisticsFacadeService } from './statistics-facade.service';

describe('StatisticsFacadeService', () => {
  let service: StatisticsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

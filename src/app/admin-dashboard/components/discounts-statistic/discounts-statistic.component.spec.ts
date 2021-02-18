import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsStatisticComponent } from './discounts-statistic.component';

describe('DiscountsStatisticComponent', () => {
  let component: DiscountsStatisticComponent;
  let fixture: ComponentFixture<DiscountsStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountsStatisticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

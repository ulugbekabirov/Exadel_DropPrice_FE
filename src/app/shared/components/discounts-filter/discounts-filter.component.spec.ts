import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsFilterComponent } from './discounts-filter.component';

describe('DiscountsFilterComponent', () => {
  let component: DiscountsFilterComponent;
  let fixture: ComponentFixture<DiscountsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

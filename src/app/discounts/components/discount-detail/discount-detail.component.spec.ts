import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountDetailComponent } from './discount-detail.component';

describe('DiscountDetailComponent', () => {
  let component: DiscountDetailComponent;
  let fixture: ComponentFixture<DiscountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

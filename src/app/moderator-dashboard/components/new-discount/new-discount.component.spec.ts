import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDiscountComponent } from './new-discount.component';

describe('NewDiscountComponent', () => {
  let component: NewDiscountComponent;
  let fixture: ComponentFixture<NewDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

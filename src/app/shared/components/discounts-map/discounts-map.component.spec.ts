import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsMapComponent } from './discounts-map.component';

describe('DiscountsMapComponent', () => {
  let component: DiscountsMapComponent;
  let fixture: ComponentFixture<DiscountsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountsMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

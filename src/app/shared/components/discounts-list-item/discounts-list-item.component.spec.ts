import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsListItemComponent } from './discounts-list-item.component';

describe('DiscountsListItemComponent', () => {
  let component: DiscountsListItemComponent;
  let fixture: ComponentFixture<DiscountsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountsListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

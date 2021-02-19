import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersListItemComponent } from './orders-list-item.component';

describe('OrdersListItemComponent', () => {
  let component: OrdersListItemComponent;
  let fixture: ComponentFixture<OrdersListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

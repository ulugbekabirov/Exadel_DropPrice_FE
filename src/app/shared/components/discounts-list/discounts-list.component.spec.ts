import { ComponentFixture, TestBed } from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import { DiscountsListComponent } from './discounts-list.component';
import {By} from '@angular/platform-browser';

describe('DiscountsListComponent', () => {
  let component: DiscountsListComponent;
  let fixture: ComponentFixture<DiscountsListComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the discount list', () => {

    fixture.detectChanges();

    const lists = el.queryAll(By.css('.discount-card'));

    expect(lists).toBeTruthy('Could not find lists');

  });
});

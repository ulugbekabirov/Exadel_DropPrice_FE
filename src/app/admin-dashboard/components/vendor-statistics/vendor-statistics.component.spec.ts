import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorStatisticsComponent } from './vendor-statistics.component';

describe('VendorStatisticsComponent', () => {
  let component: VendorStatisticsComponent;
  let fixture: ComponentFixture<VendorStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

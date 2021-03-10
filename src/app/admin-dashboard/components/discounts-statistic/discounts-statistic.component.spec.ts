import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsStatisticComponent } from './discounts-statistic.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StatisticsFacadeService } from '../../services/statistics-facade.service';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DiscountsStatisticComponent', () => {
  let component: DiscountsStatisticComponent;
  let fixture: ComponentFixture<DiscountsStatisticComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        MatSortModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
        ],
      declarations: [ DiscountsStatisticComponent],
      providers: [FormBuilder, StatisticsFacadeService]

    });
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

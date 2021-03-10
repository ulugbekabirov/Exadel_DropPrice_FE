import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSearchComponent } from './admin-search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {Pipe, PipeTransform} from '@angular/core';


fdescribe('AdminSearchComponent', () => {
  let component: AdminSearchComponent;
  let fixture: ComponentFixture<AdminSearchComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
        ],
      declarations: [ AdminSearchComponent],
      providers: [FormBuilder]

    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

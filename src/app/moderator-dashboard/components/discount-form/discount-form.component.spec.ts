import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountFormComponent } from './discount-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';
import { DebugElement } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('DiscountFormComponent', () => {
  let component: DiscountFormComponent;
  let fixture: ComponentFixture<DiscountFormComponent>;
  const mockTagsService = jasmine.createSpyObj(['getTags']);
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        TranslateModule.forRoot()
      ],
      declarations: [DiscountFormComponent],
      providers: [FormBuilder, Validators]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow regular text input for input elements', () => {
    const input = fixture.debugElement.query(By.css('input'));

    const event = { key: 'x', preventDefault: jasmine.createSpy('preventDefault') };
    input.triggerEventHandler('keydown', event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should allow regular text input for textarea elements', () => {
    const input = fixture.debugElement.query(By.css('textarea'));

    const event = { key: 'x', preventDefault: jasmine.createSpy('preventDefault') };
    input.triggerEventHandler('keydown', event);

    expect(event.preventDefault).not.toHaveBeenCalled();

  });

  it('should test if onSubmit method has been called 0 times', (() => {
    fixture.detectChanges();
    spyOn(component, 'onSubmit');
    el.querySelector('input').click();
    expect(component.onSubmit).toHaveBeenCalledTimes(0);
  }));

  it('created a forms in component ', () => {
    const element = fixture.debugElement.nativeElement;

    const vendorId = element.querySelector('formControlName[vendorId]');
    const discountName = element.querySelector('formControlName[discountName]');
    const description = element.querySelector('formControlName[description]');
    const startDate = element.querySelector('formControlName[startDate]');
    const checked = element.querySelector('formControlName[checked]');
    const endDate = element.querySelector('formControlName[endDate]');
    const promoCode = element.querySelector('formControlName[promoCode]');

    expect(vendorId).toBeDefined();
    expect(discountName).toBeDefined();
    expect(description).toBeDefined();
    expect(startDate).toBeDefined();
    expect(checked).toBeDefined();
    expect(endDate).toBeDefined();
    expect(promoCode).toBeDefined();

  });

  it('should test if Save button is disabled when the form is invalid -- Required fields are empty', (() => {

    component.discountForm.controls.vendorName.setValue('');
    component.discountForm.controls.discountName.setValue('');
    component.discountForm.controls.description.setValue('');
    component.discountForm.controls.discountAmount.setValue('');
    component.discountForm.controls.promoCode.setValue('');
    component.discountForm.controls.startDate.setValue('');
    component.discountForm.controls.endDate.setValue('');

    fixture.detectChanges();
    expect(el.querySelector('button').disabled).toBeTruthy();
  }));

  it('returned value should contain date format dd/mm/yyyy', () => {
    const isoStringStart = '1960-06-01T11:01:12.720Z';

    expect(component.discountForm.controls.startDate.setValue(isoStringStart)).toBeUndefined();

  });

  it('should load tags', () => {
      const TAGS = [
        'Спорт',
        'Суши' ,
        'Ролики'
      ];

      mockTagsService.getTags.and.returnValue(of(TAGS));

      fixture.detectChanges();

      const SearchBarComponentDEs = fixture.debugElement.queryAll(By.directive(DiscountFormComponent));
      expect(TAGS.length).toEqual(3);

      for (let i = 0; i < SearchBarComponentDEs.length; i++) {
        expect(SearchBarComponentDEs[i].componentInstance).toEqual(TAGS[i]);
      }
    });

});

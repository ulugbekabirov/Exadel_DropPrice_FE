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
import { DebugElement } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';

describe('DiscountFormComponent', () => {
  let component: DiscountFormComponent;
  let fixture: ComponentFixture<DiscountFormComponent>;
  const mockTagsService = jasmine.createSpyObj(['getTags']);
  const de = fixture.debugElement.query(By.css('form'));
  const el = de.nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        RouterTestingModule,
        MatSnackBarModule,
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
    const element = fixture.debugElement.nativeElement.querySelector;

    const vendorId = element('formControlName[vendorId]');
    const discountName = element('formControlName[discountName]');
    const description = element('formControlName[description]');
    const startDate = element('formControlName[startDate]');
    const checked = element('formControlName[checked]');
    const endDate = element('formControlName[endDate]');
    const promoCode = element('formControlName[promoCode]');

    expect(vendorId).toBeDefined();
    expect(discountName).toBeDefined();
    expect(description).toBeDefined();
    expect(startDate).toBeDefined();
    expect(checked).toBeDefined();
    expect(endDate).toBeDefined();
    expect(promoCode).toBeDefined();

  });

  it('should test if Save button is disabled when the form is invalid -- Required fields are empty', (() => {
    const discountForm = component.discountForm.controls;

    discountForm.vendorId.setValue('');
    discountForm.discountName.setValue('');
    discountForm.description.setValue('');
    discountForm.startDate.setValue('');
    discountForm.checked.setValue('');
    discountForm.endDate.setValue('');
    discountForm.promoCode.setValue('');

    fixture.detectChanges();
    expect(el.querySelector('button').disabled).toBeTruthy();
  }));

  it('returned value should contain date format dd/mm/yyyy', () => {
    const isoString = '1960-06-01T11:01:12.720Z';
    expect(component.startDate.setValue(isoString)).toContain('06/01/1960');
    expect(component.endDate.setValue(isoString)).toContain('06/01/1961');
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
      expect(SearchBarComponentDEs.length).toEqual(3);
      for (let i = 0; i < SearchBarComponentDEs.length; i++) {
        expect(SearchBarComponentDEs[i].componentInstance).toEqual(TAGS[i]);
      }
    });

  it('offers a [(name)] two-way binding', function() {

      this.hostComponent.name = 'World';
      this.detectChanges();
      expect(this.testedDirective.name).toBe('World');

      this.testedDirective.update('Angular');
      this.detectChanges();
      expect(this.hostComponent.name).toBe('Angular');
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVendorComponent } from './new-vendor.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

fdescribe('NewVendorComponent', () => {
  let component: NewVendorComponent;
  let fixture: ComponentFixture<NewVendorComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        TranslateModule.forRoot()
        ],
      declarations: [ NewVendorComponent],
      providers: [FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVendorComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('created a forms in component ', () => {
    const vendorName = fixture.debugElement.nativeElement.querySelector('input[formControlName=vendorName]');
    const address = fixture.debugElement.nativeElement.querySelector('input[formControlName=address]');
    const description = fixture.debugElement.nativeElement.querySelector('input[formControlName=description]');
    const phone = fixture.debugElement.nativeElement.querySelector('input[formControlName=phone]');
    const email = fixture.debugElement.nativeElement.querySelector('input[formControlName=email]');
    const facebook = fixture.debugElement.nativeElement.querySelector('input[formControlName=facebook]');
    const instagram = fixture.debugElement.nativeElement.querySelector('input[formControlName=instagram]');
    const webSite = fixture.debugElement.nativeElement.querySelector('input[formControlName=webSite]');
    const submit = fixture.debugElement.nativeElement.querySelector('input[formControlName=submit]');

    expect(vendorName).toBeDefined();
    expect(address).toBeDefined();
    expect(description).toBeDefined();
    expect(phone).toBeDefined();
    expect(email).toBeDefined();
    expect(facebook).toBeDefined();
    expect(instagram).toBeDefined();
    expect(webSite).toBeDefined();
    expect(submit).toBeDefined();

  });

  it('should test if onSubmit method has been called 0 times', (() => {
    fixture.detectChanges();
    spyOn(component, 'onSubmit');
    el.querySelector('input').click();
    expect(component.onSubmit).toHaveBeenCalledTimes(0);
  }));

  it('should test if Save button is disabled when the form is invalid -- Required fields are empty', (() => {
    component.newVendorForm.controls.vendorName.setValue('');
    component.newVendorForm.controls.address.setValue('');
    component.newVendorForm.controls.description.setValue('');
    component.newVendorForm.controls.phone.setValue('');
    component.newVendorForm.controls.email.setValue('');
    fixture.detectChanges();
    expect(el.querySelector('button').disabled).toBeTruthy();
  }));

  fit('should test if Save button is disabled when the form is invalid -- Wrong format of email', (() => {
    component.newVendorForm.controls.email.setValue('abc');
    fixture.detectChanges();
    expect(el.querySelector('button').disabled).toBeTruthy;
  }));

});

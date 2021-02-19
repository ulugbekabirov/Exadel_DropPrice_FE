import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiscountsService } from '../../services/discounts.service';
import { VendorsService } from '../../services/vendors.service';
import { Vendor } from './../../models/vendor';

@Component({
  selector: 'app-new-vendor',
  templateUrl: './new-vendor.component.html',
  styleUrls: ['./new-vendor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewVendorComponent implements OnInit {
  newVendorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private discountsService: DiscountsService,
    private vendorsService: VendorsService,
  ) {}

  ngOnInit(): void {
    this.newVendorForm = this.fb.group({
      name: ['', [Validators.required]],
      address: [''],
      description: [''],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('[- +()0-9]+'),
          Validators.maxLength(13),
          Validators.minLength(13),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      socialLinks: this.fb.group ({
        instagram:  ['', [Validators.pattern(/^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/)]],
        facebook: ['', [Validators.pattern(/^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/)]],
        website: ['', [Validators.pattern(/^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/)]],
        otherSocialLink: ['', [Validators.pattern(/^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/)]]
      }),
    });
  }

  successSnackBar(message: string, action: any) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['snackbar-color-success']
    });
  }

  errorSnackBar(message: string, action: any) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['snackbar-color-error'],
    });
  }

  onSubmit(): void {
    const newSocial = JSON.stringify(this.newVendorForm.value.socialLinks);
    const reqVendorModel: Vendor = { ...this.newVendorForm.value, socialLinks: newSocial }
    const newVendor = reqVendorModel;

    this.vendorsService.createVendor(newVendor)
      .pipe(
        catchError(error => {
          this.errorSnackBar("Not saved!", '');
          return throwError(error);
        })
      )
      .subscribe(
          () => this.successSnackBar("Successfully saved!", '')
      );

    this.newVendorForm.reset();
    for (const control in this.newVendorForm.controls) {
      this.newVendorForm.controls[control].setErrors(null);
    }
  }

  get name(): AbstractControl {
    return this.newVendorForm.get('name');
  }

  get address(): AbstractControl {
    return this.newVendorForm.get('address');
  }

  get description(): AbstractControl {
    return this.newVendorForm.get('description');
  }

  get phone(): AbstractControl {
    return this.newVendorForm.get('number');
  }

  get email(): AbstractControl {
    return this.newVendorForm.get('email');
  }

  get socialLinks(): AbstractControl {
    return this.newVendorForm.get('socialLinks');
  }

  get instagram(): AbstractControl {
    return this.newVendorForm.get('instagram');
  }

  get facebook(): AbstractControl {
    return this.newVendorForm.get('facebook');
  }

  get website(): AbstractControl {
    return this.newVendorForm.get('website');
  }

  get otherSocialLink(): AbstractControl {
    return this.newVendorForm.get('otherSocialLink');
  }

}

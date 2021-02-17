import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiscountsService } from '../../services/discounts.service';
import { VendorsService } from '../../services/vendors.service';

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
    private snackBar: MatSnackBar,
    private discountsService: DiscountsService,
    private vendorsService: VendorsService
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
      social_network: this.fb.group ({
        instagram:  ['', [Validators.pattern(/^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/)]],
        facebook: ['', [Validators.pattern(/^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/)]],
        website: ['', [Validators.pattern(/^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/)]],
        otherSocialLink: ['', [Validators.pattern(/^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/)]]
      })
    });
  }

  openSnackBar(message="Successfully saved!", action = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['snack-bar-color'],
      horizontalPosition: 'center'
    });
  }

  onSubmit(): void {
    const newVendor = this.newVendorForm.value;
    this.openSnackBar();
    this.vendorsService.postVendor(newVendor)
      .subscribe(res => console.log('res', res));
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

  get phone(): AbstractControl {
    return this.newVendorForm.get('number');
  }

  get email(): AbstractControl {
    return this.newVendorForm.get('email');
  }

  get social_network(): AbstractControl {
    return this.newVendorForm.get('social_network');
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

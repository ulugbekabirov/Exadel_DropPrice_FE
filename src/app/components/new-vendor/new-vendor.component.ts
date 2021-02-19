import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { DiscountsService } from '../../services/discounts.service';
import { VendorsService } from '../../services/vendors.service';

import { ActivatedRoute, Router } from '@angular/router';


import { Vendor } from './../../models/vendor';
import { Location } from '@angular/common';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-vendor',
  templateUrl: './new-vendor.component.html',
  styleUrls: ['./new-vendor.component.scss'],
})
export class NewVendorComponent implements OnInit, OnDestroy {
  newVendorForm: FormGroup;
  vendor: Vendor;
  vendId: any;
  private unsubscribe$ = new Subject<void>();
  isEditMode: boolean = (this.router.url).includes('edit');


  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private discountService: DiscountsService,
              private vendorsService: VendorsService,
              private router: Router,
              private location: Location) {
  }


  ngOnInit(): void {
    this.newVendorForm = this.fb.group({
      vendorName: ['', [Validators.required]],
      address: [''],
      description: [''],
      phone: ['',
        [
          Validators.required,
          Validators.pattern(/^((8|\+7|\+3|\+9|)*\d{0,3}[\- ]?)*\d{0,3}?(\(?\d{1,3}\)?[\- ]?)?[\d\- ]{7,10}$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      socialLinks: this.fb.group({
        instagram: ['',
          // [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]
        ],
        facebook: ['',
          // [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]
        ],
        website: ['',
          // [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]
        ],
        otherLinks: ['',
          // [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]
        ]
      })
    });

    if (this.isEditMode) {
      this.route.paramMap
        .pipe(
          switchMap((params: any) => {
            this.vendId = +params.get('id');
            return this.vendorsService.getVendorById(this.vendId);
          }),
          takeUntil(this.unsubscribe$)
        ).subscribe((vendor) => {
        this.newVendorForm.patchValue({
          ...vendor, socialLinks: JSON.parse(vendor.socialLinks)
        });
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    const vendor = this.newVendorForm.value;
    const vendorModel = {...vendor, socialLinks: JSON.stringify(vendor.socialLinks)};
    if (this.isEditMode) {
      this.vendorsService.updateVendor(vendorModel, this.vendId).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(() => this.goBack());
    } else {
      this.vendorsService.createVendor(vendorModel).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(res => {
        this.newVendorForm.reset();
        for (const control in this.newVendorForm.controls) {
          this.newVendorForm.controls[control].setErrors(null);
        }
      });
    }
  }

  get name(): AbstractControl {
    return this.newVendorForm.get('vendorName');
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

  get social_network(): AbstractControl {
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

  get otherLinks(): AbstractControl {
    return this.newVendorForm.get('otherLinks');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

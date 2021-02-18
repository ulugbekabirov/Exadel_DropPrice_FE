import { Component, OnInit } from '@angular/core';
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
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-new-vendor',
  templateUrl: './new-vendor.component.html',
  styleUrls: ['./new-vendor.component.scss'],
})
export class NewVendorComponent implements OnInit {
  newVendorForm: FormGroup;
  vendor: Vendor;
  vendId: any;


  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private discountService: DiscountsService,
              private vendorsService: VendorsService,
              private router: Router,
              private location: Location)  {}


  ngOnInit(): void {
    this.newVendorForm = this.fb.group({
      name: ['', [Validators.required]],
      address: [''],
      description: [''],
      phone: [

        '',
        [
          Validators.required,
          Validators.pattern(/^((8|\+7|\+3|\+9|)*\d{0,3}[\- ]?)*\d{0,3}?(\(?\d{1,3}\)?[\- ]?)?[\d\- ]{7,10}$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      socialLinks: this.fb.group({
        instagram: ['', [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]],
        facebook: ['', [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]],
        website: ['', [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]],
        otherSocialLink: ['', [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]]
      })
    });

    if ((this.router.url).includes('edit')) {
      this.route.paramMap
        .pipe(
          switchMap((params: any) => {
            this.vendId = +params.get('id');
            return this.vendorsService.getVendorById(this.vendId);
          }),
        ).subscribe((vendor) => {
          const json = JSON.parse(vendor.socialLinks)
          for (let key in json) {
            if (json[key]) {
              json[key] = json[key].trim();
            }
          }
          this.newVendorForm.patchValue({
            name: vendor.vendorName,
            address: vendor.address,
            description: vendor.description,
            phone: vendor.phone.trim(),
            email: vendor.email,
            socialLinks: {
              instagram: (json.instagram),
              facebook: (json.facebook),
              website: (json.webSite),
              otherSocialLink: (json.vk)
            }
          });
        });
    }
  }

  goBack() {
    this.location.back();
  }

  onSubmit(): void {
    const newSocial = JSON.stringify(this.newVendorForm.value.socialLinks);
    const reqVendorModel: Vendor = { ...this.newVendorForm.value, socialLinks: newSocial }
    if ((this.router.url).includes('edit')) {
      const updateVendor: Vendor = reqVendorModel;
      this.vendorsService.updateVendor(updateVendor, this.vendId).subscribe(() => this.goBack());
    } else {
      const newVendor = reqVendorModel;
      this.vendorsService.createVendor(newVendor)
        .subscribe(res => console.log('res', res));
    }
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

  get otherSocialLink(): AbstractControl {
    return this.newVendorForm.get('otherSocialLink');
  }
}

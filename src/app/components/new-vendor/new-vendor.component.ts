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
          Validators.pattern(/^((8|\+7|\+3)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/),
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

    this.route.paramMap
    .pipe(
      switchMap((params: any) => {
        this.vendId = +params.get("id");
        return this.vendorsService.getVendorById(this.vendId)
      }),
    ).subscribe((vendor) => {
      console.log(vendor.socialLinks)
      const json = JSON.parse(vendor.socialLinks);
      this.newVendorForm.patchValue({
        name: vendor.vendorName,
        address: vendor.address,
        description: vendor.description,
        phone: vendor.phone.trim(),
        email: vendor.email,
        social_network: {
          instagram: (json["Instagram"]).trim(),
          facebook: (json["Facebook"]).trim(),
          website: (json["WebSite"]).trim(),
          otherSocialLink: (json["Vk"]).trim()
        }
      });
    })
  }

  goBack() {
    this.location.back();
  }

  onSubmit(): void {
    const newSocial = JSON.stringify(this.newVendorForm.value.social_network);
    this.newVendorForm.value.social_network = newSocial;
    if((this.router.url).includes("edit")){
      const updateVendor: Vendor = this.newVendorForm.value;
      console.log(updateVendor)
      this.vendorsService.updateVendor(updateVendor, this.vendId).subscribe(() => this.goBack());
    } else {

    const newVendor = this.newVendorForm.value;
    this.vendorsService.postVendor(newVendor)
      .subscribe(res => console.log('res', res));
    this.newVendorForm.reset();
    for (const control in this.newVendorForm.controls) {
      this.newVendorForm.controls[control].setErrors(null);
    }
    this.newVendorForm.reset();
    for (const control in this.newVendorForm.controls) {
        this.newVendorForm.controls[control].setErrors(null);
      }
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

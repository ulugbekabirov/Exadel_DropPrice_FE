import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { DiscountsService } from 'src/app/services/discounts.service';
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
    private router: Router,
    private location: Location)  {}

  ngOnInit(): void {
    this.newVendorForm = this.fb.group({
      name: ['', [Validators.required]],
      address: [''],
      description: [''],
      number: [
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
        return this.discountService.getVendorById(this.vendId)
      }),
    ).subscribe((vendor) => {
      console.log(vendor.socialLinks)
      const json = JSON.parse(vendor.socialLinks);
      this.newVendorForm.patchValue({
        name: vendor.vendorName,
        address: vendor.address,
        description: vendor.description,
        number: vendor.phone.trim(),
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
    if((this.router.url).includes("edit")){
      const newSocial = JSON.stringify(this.newVendorForm.value.social_network);
      this.newVendorForm.value.social_network = newSocial;
      const updateVendor: Vendor = this.newVendorForm.value;
      console.log(updateVendor)
      this.discountService.updateVendor(updateVendor, this.vendId).subscribe(() => this.goBack());
    } else {
      this.newVendorForm.value;
      
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

  get number(): AbstractControl {
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

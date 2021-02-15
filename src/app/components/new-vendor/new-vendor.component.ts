import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { DiscountsService } from 'src/app/services/discounts.service';
import { Vendor } from './../../models/vendor';

@Component({
  selector: 'app-new-vendor',
  templateUrl: './new-vendor.component.html',
  styleUrls: ['./new-vendor.component.scss'],
})
export class NewVendorComponent implements OnInit {
  newVendorForm: FormGroup;
  vendor: Vendor;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private discountService: DiscountsService)  {}

  ngOnInit(): void {
    this.newVendorForm = this.fb.group({
      name: ['', [Validators.required]],
      address: [''],
      description: [''],
      number: [
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
    this.route.paramMap.subscribe(params =>{
      const vendId = +params.get('id');
      if(vendId) {
        this.getVendor(vendId);
      }
    });
  }

  getVendor(id: number){
    this.discountService.getVendorById(id).subscribe(
      (vendor: Vendor)=> this.editVendor(vendor),
      (err: any) => console.log(err)
    );

  }

  editVendor(vendor: Vendor){
    
    // const json = JSON.parse(vendor.socialLinks);
   
    console.log(JSON.parse(JSON.stringify(vendor.socialLinks)))
    
    const social_links = JSON.parse(JSON.stringify(vendor.socialLinks))
    console.log(social_links.facebook)
    console.log(vendor)
    this.newVendorForm.patchValue({
      name: vendor.vendorName,
      address: vendor.address,
      description: vendor.description,
      number: vendor.phone,
      email: vendor.email,
      social_network: {
        instagram: social_links.instagram,
        facebook: social_links.facebook,
        website: social_links.website,
        otherSocialLink: social_links.otherSocialLink
      }
    //   social_networkGroup:{
    //     instagram: vendor.socialLinks.instagram,
    //     facebook: vendor.socialLinks.facebook,
    //     website:  vendor.socialLinks.website,
    //     otherSocialLink: vendor.socialLinks.otherSocialLink
    // },
    });
  }
  

  onSubmit(): void {
    this.newVendorForm.value;
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

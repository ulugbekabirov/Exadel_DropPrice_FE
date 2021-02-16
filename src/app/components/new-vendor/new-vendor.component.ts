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
          Validators.pattern(/^((8|\+3)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/),
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
      (vendor: Vendor)=> {
        this.editVendor(vendor),
        this.vendor = vendor
      },
      (err: any) => console.log(err)
    );

  }

  editVendor(vendor: Vendor){ 
    const json = JSON.parse(vendor.socialLinks)
    console.log(json)
    console.log(vendor)
    console.log(json["Instagram"])
    this.newVendorForm.patchValue({
      name: vendor.vendorName,
      address: vendor.address,
      description: vendor.description,
      number: vendor.phone,
      email: vendor.email,
      social_network: {
        instagram: (json["Instagram"]).trim(),
        facebook: (json["Facebook"]).trim(),
        website: (json["WebSite"]).trim(),
        otherSocialLink: (json["Vk"]).trim()
      }
    });
  }
  
  updateVendor(id: number, vendor: Vendor){
    this.discountService.updateVendor(id, vendor).subscribe(()=> this.goBack());
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if((this.router.url).includes("edit")){
      
    } else {
      this.newVendorForm.value;
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

import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-new-vendor',
  templateUrl: './new-vendor.component.html',
  styleUrls: ['./new-vendor.component.scss'],
})
export class NewVendorComponent implements OnInit {
  hide = false;
  newVendorForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.newVendorForm = this.fb.group({
      name: ['', [Validators.required]],
      adress: [''],
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
    });
  }

  onSubmit() {
    console.log(this.newVendorForm.value);
  }

  addField() {
    // this.fb.group({
    //   additional_adress: [''],
    // });
    console.log('Sdfsd');
  }

  get name(): AbstractControl {
    return this.newVendorForm.get('name');
  }

  get adress(): AbstractControl {
    return this.newVendorForm.get('adress');
  }

  get number(): AbstractControl {
    return this.newVendorForm.get('number');
  }

  get email(): AbstractControl {
    return this.newVendorForm.get('email');
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  AbstractControl,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-new-discount',
  templateUrl: './new-discount.component.html',
  styleUrls: ['./new-discount.component.scss'],
})
export class NewDiscountComponent implements OnInit {
  hide = true;
  newDiscountForm: FormGroup;
  obj: any;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.newDiscountForm = this.fb.group({
      discount_name: '',
      pointsOfSales: this.fb.array([]),
    });
  }

  onSubmit(): void {
    console.log(this.newDiscountForm.value);
  }

  addPoint() {
    this.hide = false;
    const point = this.fb.group({
      name: ['', [Validators.required]],
      adress: ['', [Validators.required]],
    });
    this.pointOfSalesForms.push(point);
    // this.obj = { latitude: 12, longitude: 2 };
    // console.log(Object.assign(point.value, this.obj));
  }

  deletePoint(i) {
    this.pointOfSalesForms.removeAt(i);
  }

  get discount_name(): AbstractControl {
    return this.newDiscountForm.get('discount_name');
  }

  get name(): AbstractControl {
    return this.pointOfSalesForms.get('name');
  }

  get adress(): AbstractControl {
    return this.pointOfSalesForms.get('adress');
  }

  get pointOfSalesForms() {
    return this.newDiscountForm.get('pointsOfSales') as FormArray;
  }
}

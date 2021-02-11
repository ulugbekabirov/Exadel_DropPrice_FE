import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DiscountsService } from '../../services/discounts.service';
import { Vendor } from '../../models';

import { map, startWith, debounceTime, filter} from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
export interface Tag {
  name: string;
}
@Component({
  selector: 'app-new-discount',
  templateUrl: './new-discount.component.html',
  styleUrls: ['./new-discount.component.scss'],
})
export class NewDiscountComponent implements OnInit, OnDestroy {
  newDiscountForm: FormGroup;
  hide = true;
  tagsArray: Tag[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isChecked = true;

  vendorsList: Vendor[];
  filteredList: Vendor[];
  filteredVendors: Observable<Vendor[]>;
  private subscription: Subscription;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocompleteModule;

  constructor(
    public translateService: TranslateService,
    public fb: FormBuilder,
    private discountService: DiscountsService,
  ) {}

  ngOnInit(): void {

    this.subscription = this.discountService.getVendors()
      .subscribe(res => {
        this.vendorsList = this.filteredList = res;
    });

    this.newDiscountForm = this.fb.group({
      vendorName: ['', [Validators.required, this.requireMatch.bind(this)]],
      discountName: ['', [Validators.required]],
      descriptionDiscount: ['', [Validators.required]],
      discountAmount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      promoCode: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      tags: this.fb.array([], Validators.required),
      activityStatus: [true, [Validators.requiredTrue]],
      pointsOfSales: this.fb.array([], Validators.required),
    });

    this.vendorNameDetectChanges();
  }

  vendorNameDetectChanges(): void {
    this.newDiscountForm.get('vendorName').valueChanges.pipe(
      debounceTime(300),
      startWith('')
    )
    .subscribe(
      (data) => {
        if (!this.vendorsList || !data ) {
          this.filteredList = this.vendorsList;
          return;
        }
        this.filteredList = this.vendorsList.filter(value => value.vendorName.includes(data) );
      });
  }

  private requireMatch(control: AbstractControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.vendorsList && this.vendorsList.find(x => x.vendorName.includes(selection))) {
      return null;
    }
    return { requireMatch: true };
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const index = this.tags.value.includes(value);

      if (!index) {
        this.tags.push(new FormControl(value.trim()));
      }
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    const index = this.tags.value.indexOf(tag.value);

    if (index >= 0) {
      this.tags.value.splice(index, 1);
    }

    this.tags.controls.forEach((item, indx) => {
      if (item.value === tag.value) {
        this.tags.controls.splice(indx, 1);
      }
    });
  }

  addPoint(): void {
    this.hide = false;
    const point = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
    this.pointOfSalesForms.push(point);
  }

  deletePoint(i): void {
    this.pointOfSalesForms.removeAt(i);
  }

  addLocation(i): void {
    console.log(`ADD location to ${i} object`);
  }

  submit(): void {
    this.newDiscountForm.value;
    this.newDiscountForm.reset();

    for (const control in this.newDiscountForm.controls) {
      this.newDiscountForm.controls[control].setErrors(null);
    }

    this.tags.controls = [];
  }

  get vendorName(): AbstractControl {
    return this.newDiscountForm.get('vendorName');
  }

  get discountName(): AbstractControl {
    return this.newDiscountForm.get('discountName');
  }

  get descriptionDiscount(): AbstractControl {
    return this.newDiscountForm.get('descriptionDiscount');
  }

  get discountAmount(): AbstractControl {
    return this.newDiscountForm.get('discountAmount');
  }

  get promoCode(): AbstractControl {
    return this.newDiscountForm.get('promoCode');
  }

  get startDate(): AbstractControl {
    return this.newDiscountForm.get('startDate');
  }

  get endDate(): AbstractControl {
    return this.newDiscountForm.get('endDate');
  }

  get tags(): FormArray {
    return this.newDiscountForm.get('tags') as FormArray;
  }

  get activityStatus(): AbstractControl {
    return this.newDiscountForm.get('activityStatus');
  }

  get name(): AbstractControl {
    return this.pointOfSalesForms.get('name');
  }

  get address(): AbstractControl {
    return this.pointOfSalesForms.get('address');
  }

  get pointOfSalesForms(): FormArray {
    return this.newDiscountForm.get('pointsOfSales') as FormArray;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

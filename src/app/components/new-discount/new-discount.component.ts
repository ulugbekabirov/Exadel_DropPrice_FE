import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { 
  AbstractControl, 
  FormArray, 
  FormBuilder, 
  FormControl, 
  FormGroup, 
  FormGroupDirective, 
  Validators, 
  ValidationErrors 
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export interface Tag {
  name: string;
}

@Component({
  selector: 'app-new-discount',
  templateUrl: './new-discount.component.html',
  styleUrls: ['./new-discount.component.scss']
})

export class NewDiscountComponent implements OnInit {
  
  newDiscountForm: FormGroup;

  tagsArray: Tag[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isChecked = true;

  vendors: string[] = ['Astra', 'BacardiGroup', 'Citrus', 'DriverPlus','Eshko', 'Focus', 'Green', 'Hudson', 'SportBet','Sportmaster'];
  filteredVendors: Observable<string[]>;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocompleteModule;
  
  constructor(
    public translateService: TranslateService, 
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {

    this.newDiscountForm = this.fb.group({
      vendorName: ['', [Validators.required, this.requireMatch.bind(this)]],
      discountName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      discountAmount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      promoCode: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      tags: this.fb.array([]),
      activityStatus: [true, [Validators.requiredTrue]]
    })

    this.filteredVendors = this.newDiscountForm.get('vendorName').valueChanges
      .pipe(
        startWith(''),
        map(name => name ? this._filter(name) : this.vendors.slice())
      );
  }

  private requireMatch(control: AbstractControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.vendors && this.vendors.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  } 

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.vendors.filter(vendor => vendor.toLowerCase().indexOf(filterValue) === 0);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push(new FormControl(value.trim()));
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: Tag): void {
    const index = this.tagsArray.indexOf(tag);

    if (index >= 0) {
      this.tagsArray.splice(index, 1);
    }
  }

  submit(): void {
    this.newDiscountForm.value;
    console.log("Form Submitted!", this.newDiscountForm.value);
    this.newDiscountForm.reset();
    for (const control in this.newDiscountForm.controls) {
      this.newDiscountForm.controls[control].setErrors(null);
    }
  }

  get vendorName(): AbstractControl {
    return this.newDiscountForm.get('vendorName');
  }

  get discountName(): AbstractControl {
    return this.newDiscountForm.get('discountName');
  }

  get description(): AbstractControl {
    return this.newDiscountForm.get('description');
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
}

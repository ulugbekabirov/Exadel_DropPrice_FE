import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { MapComponent } from './../map/map.component';

export interface Tag {
  name: string;
}

@Component({
  selector: 'app-new-discount',
  templateUrl: './new-discount.component.html',
  styleUrls: ['./new-discount.component.scss'],
})
export class NewDiscountComponent implements OnInit {
  newDiscountForm: FormGroup;
  coordinateIsEmpty = true;
  tagsArray: Tag[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isChecked = true;

  vendors: string[] = [
    'Astra',
    'BacardiGroup',
    'Citrus',
    'DriverPlus',
    'Eshko',
    'Focus',
    'Green',
    'Hudson',
    'SportBet',
    'Sportmaster',
  ];
  filteredVendors: Observable<string[]>;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocompleteModule;

  constructor(
    public translateService: TranslateService,
    public fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newDiscountForm = this.fb.group({
      vendorName: ['', [Validators.required, this.requireMatch.bind(this)]],
      discountName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      discountAmount: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      promoCode: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      tags: this.fb.array([], Validators.required),
      activityStatus: [true, [Validators.requiredTrue]],
      pointsOfSales: this.fb.array([]),
    });

    this.filteredVendors = this.newDiscountForm
      .get('vendorName')
      .valueChanges.pipe(
        startWith(''),
        map((name) => (name ? this._filter(name) : this.vendors.slice()))
      );
    this.addPoint();
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

    return this.vendors.filter(
      (vendor) => vendor.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private duplicate(control: AbstractControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.tags && this.tags.value.indexOf(selection) < 0) {
      return { duplicate: true };
    }
    return null;
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

    this.tags.controls.forEach((item, index) => {
      if (item.value === tag.value) {
        this.tags.controls.splice(index, 1);
      }
    });
    console.log(this.tags);
    console.log(this.tagsArray);
  }

  addPoint() {
    const point = this.fb.group({
      name: ['', [Validators.required]],
      adress: ['', [Validators.required]],
    });
    this.pointOfSalesForms.push(point);
  }

  deletePoint(currentSaleObj) {
    this.pointOfSalesForms.removeAt(currentSaleObj);
    this.coordinateIsEmpty = true;
  }

  openDialog(currentSaleObj) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = '800px';
    dialogConfig.minWidth = '100%';
    dialogConfig.direction = 'rtl';

    console.log(this.pointOfSalesForms);
    dialogConfig.data = {
      latitude: this.pointOfSalesForms.value[currentSaleObj].latitude,
      longitude: this.pointOfSalesForms.value[currentSaleObj].longitude,
    };

    const dialogRef = this.dialog.open(MapComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log(
        Object.assign(this.pointOfSalesForms.value[currentSaleObj], data)
      );
    });
    this.coordinateIsEmpty = false;
  }

  submit(): void {
    this.newDiscountForm.value;
    console.log('Form Submitted!', this.newDiscountForm.value);

    this.newDiscountForm.reset();

    for (const control in this.newDiscountForm.controls) {
      this.newDiscountForm.controls[control].setErrors(null);
    }

    this.pointOfSalesForms.controls = [];
    this.tags.controls = [];
    console.log(this.tags);
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

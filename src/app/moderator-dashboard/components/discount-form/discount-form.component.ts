import { ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { forkJoin, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, filter, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Discount } from '../../../models';
import { ApiDataService } from '../../../services/api-data.service';
import { DiscountsService } from '../../../services/discounts.service';
import { VendorsService } from '../../../services/vendors.service';

@Component({
  selector: 'app-discount-form',
  templateUrl: './discount-form.component.html',
  styleUrls: ['./discount-form.component.scss']
})
export class DiscountFormComponent implements OnInit, OnDestroy {
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];
  discountId: number;
  private unsubscribe$ = new Subject<void>();
  isEditMode: boolean = (this.router.url).includes('edit');

  vendorsList;
  filteredList;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocompleteModule;

  discountForm: FormGroup = this.fb.group({
    vendorId: ['', this.requireMatch.bind(this)],
    vendorName: [''],
    discountName: ['', [Validators.required]],
    description: ['', [Validators.minLength(40), Validators.required]],
    discountAmount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
    promoCode: [''],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    activityStatus: [true, [Validators.requiredTrue]],
    tags: this.fb.array([], Validators.required),
    pointOfSales: this.fb.array([], [Validators.required, this.checkPoints.bind(this)]),
  });

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private discountsService: DiscountsService,
    private vendorsService: VendorsService,
    private restApi: ApiDataService
  ) {
  }

  ngOnInit(): void {

    this.vendorsService.getVendors().pipe(
      map(next => next.map(({vendorId, vendorName}) => ({vendorId, vendorName}))),
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      this.vendorsList = this.filteredList = res;
    });
    this.vendorNameChanges();

    if (this.isEditMode) {
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          this.discountId = +params.get('id');
          return this.discountsService.getDiscountById(this.discountId, {});
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(discount => {
          const editingDiscount = {...discount};
          if (editingDiscount.tags) {
            editingDiscount.tags.forEach(tag => {
              this.tags.push(
                new FormControl(tag, Validators.required));
            });
          }
          this.restApi.beginEditDiscount(this.discountId)
            .subscribe(next => {
              console.log('start session', next);
              this.snackBar.open(next.message, '', {
                duration: 5000,
                panelClass: ['snack-bar-color-success'],
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            });
          this.discountForm.patchValue(editingDiscount);
          this.discountForm.controls.vendorId.disable();
          this.discountForm.markAsPristine();
        });
    }
  }

  displayFn(value?: number | string): any {
    if (!value || !this.filteredList) {
      return;
    }
    return value ? this.filteredList.find(_ => _.vendorId === value).vendorName : undefined;
  }

  vendorNameChanges(): void {
    this.discountForm.get('vendorId').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(300),
      startWith(''),
      tap(next => {
        if (!this.vendorsList || !next || typeof next !== 'string') {
          this.filteredList = this.vendorsList;
          return;
        }
        this.filteredList = this.vendorsList.filter(value => value.vendorName.toLowerCase().includes(next.toLowerCase()));

      }),
      filter((next) => typeof next === 'number'),
      switchMap(vendorId => {
        return this.vendorsService.getVendorPointsOfSales(vendorId);
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe(points => {
      if (!points) {
        return;
      }
      this.patchPointsOfSales(points);
    });
  }

  private checkPoints(control: AbstractControl): ValidationErrors | null {
    const selection = control.value;
    if (selection && selection.filter(point => point.checked).length) {
      return null;
    }
    return {checkPoints: true};
  }

  private requireMatch(control: AbstractControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.vendorsList && this.vendorsList.find(item => item.vendorId === selection)) {
      return null;
    }
    return {requireMatch: true};
  }

  patchPointsOfSales(points): void {
    this.pointOfSalesForm.clear();
    const initPointsOfSales = {
      pointOfSales: points
    };
    initPointsOfSales.pointOfSales.forEach(point => {
      this.addPointOfSales(point);
    });
    this.discountForm.patchValue(initPointsOfSales);
    this.pointOfSalesForm.controls.forEach(control => {
      control.get('name').disable();
      control.get('address').disable();
    });
  }

  addPointOfSales(point): void {
    this.pointOfSalesForm.push(this.createPointOfSales(point));
  }

  createPointOfSales(point): FormGroup {
    return this.fb.group({
      name: point.name || '',
      address: point.address || '',
      latitude: point.latitude || '',
      longitude: point.longitude || '',
      checked: false,
    });
  }

  addTag(event: MatChipInputEvent): void {
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

  removeTag(tag: any): void {
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

  setAllPointsOfSalesChecked(checked: boolean): void {
    if (!this.pointOfSalesForm.value) {
      return;
    }
    this.pointOfSalesForm.controls.forEach(control => {
      const updateChecked = {checked};
      control.patchValue(updateChecked);
    });
  }

  onSubmit(): void {
    const discount = {...this.discountForm.getRawValue(), pointOfSales: this.pointOfSalesForm.getRawValue().filter(point => point.checked)};
    const {checked, ...newDiscount} = discount;

    if (this.isEditMode) {
      this.updateDiscount(newDiscount, this.discountId);
    } else {
      this.createDiscount(newDiscount);
    }
    this.pointOfSalesForm.clear();
    this.tags.clear();
  }

  private createDiscount(discount: Discount): void {
    this.discountsService.createDiscount(discount).pipe(
      takeUntil(this.unsubscribe$),
      catchError(error => {
        this.errorSnackBar('Not saved!', '');
        return throwError(error);
      }))
      .subscribe((res) => {
        this.discountForm.reset();
        this.successSnackBar('Successfully saved!', '');
        for (const control in this.discountForm.controls) {
          this.discountForm.controls[control].setErrors(null);
        }
        this.router.navigate(['/vendors', res.vendorId]);
      });
  }

  private updateDiscount(discount: Discount, discountId: number): void {
    this.discountsService.updateDiscount(discount, discountId).pipe(
      takeUntil(this.unsubscribe$),
      catchError(error => {
        this.errorSnackBar('Not saved!', '');
        return throwError(error);
      }))
      .subscribe((res) => {
        this.discountForm.reset();
        this.successSnackBar('Successfully update!', '');
        for (const control in this.discountForm.controls) {
          this.discountForm.controls[control].setErrors(null);
        }
        this.router.navigate(['/vendors', res.vendorId]);
      });
  }

  get vendorName(): AbstractControl {
    return this.discountForm.get('vendorName');
  }

  get vendorId(): AbstractControl {
    return this.discountForm.get('vendorId');
  }

  get discountName(): AbstractControl {
    return this.discountForm.get('discountName');
  }

  get pointOfSalesForm(): FormArray {
    return this.discountForm.get('pointOfSales') as FormArray;
  }

  get tags(): FormArray {
    return this.discountForm.get('tags') as FormArray;
  }

  get startDate(): AbstractControl {
    return this.discountForm.get('startDate');
  }

  get endDate(): AbstractControl {
    return this.discountForm.get('endDate');
  }

  get description(): AbstractControl {
    return this.discountForm.get('description');
  }

  get discountAmount(): AbstractControl {
    return this.discountForm.get('discountAmount');
  }

  successSnackBar(message: string, action: any): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['snackbar-color-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  errorSnackBar(message: string, action: any): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['snack-bar-color-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

import { Component, OnInit, ElementRef, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, Subject } from 'rxjs';
import { startWith, debounceTime, switchMap, takeUntil, catchError } from 'rxjs/operators';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
  FormArrayName,
  FormGroupName,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { COMMA, ENTER, V } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DiscountsService } from '../../../services/discounts.service';
import { Vendor, Discount } from '../../../models';

import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapComponent } from '../../../components/map/map.component';
import { VendorsService } from '../../../services/vendors.service';


export interface Tag {
  name: string;
}

@Component({
  selector: 'app-new-discount',
  templateUrl: './new-discount.component.html',
  styleUrls: ['./new-discount.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewDiscountComponent implements OnInit, OnDestroy {
  newDiscountForm: FormGroup;
  discount: Discount;
  coordinateIsEmpty = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];
  discId: number;
  private unsubscribe$ = new Subject<void>();
  isEditMode: boolean = (this.router.url).includes('edit');

  vendorsList: Vendor[];
  filteredList: Vendor[];
  pointNameList: Discount[];
  filteredPointNameList: Discount[];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocompleteModule;

  constructor(
    public fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private discountsService: DiscountsService,
    private vendorsService: VendorsService,
  ) {
  }

  ngOnInit(): void {

    this.vendorsService.getVendors().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      this.vendorsList = this.filteredList = res;
    });

    this.discountsService.getPointOfSales().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      this.pointNameList = this.filteredPointNameList = res;
    });

    this.newDiscountForm = this.fb.group({
      vendorName: [
        {value: '', disabled: this.isEditMode},
        [Validators.required, this.requireMatch.bind(this)]
      ],
      discountName: ['', [Validators.required]],
      description: ['', [Validators.minLength(40), Validators.required]],
      discountAmount: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      promoCode: [null],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      tags: this.fb.array([], Validators.required),
      activityStatus: [true, [Validators.requiredTrue]],
      pointOfSales: this.fb.array([]),
    });

    if (this.isEditMode) {
      this.route.paramMap
        .pipe(
          switchMap((params: any) => {
            this.discId = +params.get('id');
            return forkJoin(
              this.discountsService.getDiscountById(this.discId, {}),
              this.discountsService.getPointsOfSalesByDiscountId(this.discId)
            );
          }),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(([discount, points]) => {
          const editingDiscount = {...discount, pointOfSales: points};
          if (editingDiscount.tags) {
            editingDiscount.tags.forEach(tag => {
              this.tags.push(
                new FormControl(tag, Validators.required));
            });
          }
          if (editingDiscount.pointOfSales) {
            editingDiscount.pointOfSales.forEach(point => {
              this.pointOfSalesForms.push(this.editPointOfSale());
            });
          }
          this.newDiscountForm.patchValue(editingDiscount);
          this.coordinateIsEmpty = false;
          this.vendorNameDetectChanges();
          this.newDiscountForm.markAsPristine();
        });
    }
  }

  editPointOfSale(): FormGroup {
    return this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
    });
  }

  vendorNameDetectChanges(): void {
    this.newDiscountForm.get('vendorName').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(300),
      startWith(''),
    )
      .subscribe((data) => {
        if (!this.vendorsList || !data) {
          this.filteredList = this.vendorsList;
          return;
        }
        this.filteredList = this.vendorsList.filter(value => value.vendorName.includes(data));
      });
  }

  private requireMatch(control: AbstractControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.vendorsList && this.vendorsList.find(item => item.vendorName.includes(selection))) {
      return null;
    }
    return {requireMatch: true};
  }

  // TODO add filter of points
  // pointOfSalesDetectChanges(): void {
  //   const pointOfSalesControl = this.newDiscountForm.controls.pointOfSales as FormArray;
  //   pointOfSalesControl.valueChanges.subscribe(
  //     (data) => {
  //       if (!this.pointNameList || !data) {
  //         this.filteredPointNameList = this.pointNameList;
  //         return;
  //       }
  //       this.filteredPointNameList = this.pointNameList.filter(value => value.pointOfSales.includes(data));
  //       console.log(this.filteredPointNameList);
  //       console.log(data);
  //     })
  // }

  // private requireMatchPoint(control: AbstractControl): ValidationErrors | null {
  //   const selection: any = control.value;
  //   if (this.pointNameList && this.pointNameList.find(item => item.pointOfSales.includes(selection))) {
  //     return null;
  //   }
  //   return { requireMatchPoint: true };
  // }

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
    const point = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
    this.pointOfSalesForms.push(point);
  }

  deletePoint(currentSaleObj): void {
    this.pointOfSalesForms.removeAt(currentSaleObj);
    this.coordinateIsEmpty = true;
  }

  openDialog(currentSaleObj): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = '400px';
    dialogConfig.minWidth = '100%';
    dialogConfig.direction = 'rtl';

    dialogConfig.data = {
      latitude: this.pointOfSalesForms.value[currentSaleObj].latitude,
      longitude: this.pointOfSalesForms.value[currentSaleObj].longitude,
    };

    const dialogRef = this.dialog.open(MapComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      Object.assign(this.pointOfSalesForms.value[currentSaleObj], data);
    });
    this.coordinateIsEmpty = false;
  }

  successSnackBar(message: string, action: any): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['snackbar-color-success'],
      horizontalPosition: 'center'
    });
  }

  errorSnackBar(message: string, action: any): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['snack-bar-color-error'],
      horizontalPosition: 'center'
    });
  }

  private updateDiscount(discount: Discount, discId: number): void {
    this.discountsService.updateDiscount(discount, discId).pipe(
      takeUntil(this.unsubscribe$),
      catchError(error => {
        this.errorSnackBar('Not saved!', '');
        return throwError(error);
      }))
      .subscribe((res) => {
        this.newDiscountForm.reset();
        this.successSnackBar('Successfully update!', '');
        for (const control in this.newDiscountForm.controls) {
          this.newDiscountForm.controls[control].setErrors(null);
        }
        this.router.navigate(['/discounts', res.id]);
      });
  }

  private createDiscount(discount: Discount): void {
    this.discountsService.createDiscount(discount).pipe(
      takeUntil(this.unsubscribe$),
      catchError(error => {
        this.errorSnackBar('Not saved!', '');
        return throwError(error);
      }))
      .subscribe((res) => {
        this.newDiscountForm.reset();
        this.successSnackBar('Successfully saved!', '');
        for (const control in this.newDiscountForm.controls) {
          this.newDiscountForm.controls[control].setErrors(null);
        }
      });
  }

  onSubmit(): void {
    const discount = this.newDiscountForm.value;
    if (this.isEditMode) {
      this.updateDiscount(discount, this.discId);
    } else {
      this.createDiscount(discount);
    }
    this.pointOfSalesForms.clear();
    this.tags.clear();
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

  get address(): AbstractControl {
    return this.pointOfSalesForms.get('address');
  }

  get pointOfSalesForms(): FormArray {
    return this.newDiscountForm.get('pointOfSales') as FormArray;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

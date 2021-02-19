import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, Subject } from 'rxjs';
import { startWith, debounceTime, switchMap, takeUntil } from 'rxjs/operators';
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

import { DiscountsService } from '../../services/discounts.service';
import { VendorsService } from '../../services/vendors.service';

import { MapComponent } from './../map/map.component';

import { Discount } from './../../models/discount';
import { Vendor } from '../../models';
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
  discount: Discount;
  coordinateIsEmpty = true;
  tagsArray: Tag[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isChecked = true;
  discId: number;

  vendorsList: Vendor[];
  filteredList: Vendor[];
  private subscription: Subscription;
  private unsubscribe$ = new Subject<void>();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocompleteModule;

  constructor(
    public translateService: TranslateService,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private discountsService: DiscountsService,
    private vendorsService: VendorsService,
  ) {}

  ngOnInit(): void {

    this.subscription = this.vendorsService.getVendors()
      .subscribe(res => {
        this.vendorsList = this.filteredList = res;
    });

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
      pointOfSales: this.fb.array([], Validators.required),
    });
    this.vendorNameDetectChanges();

    if((this.router.url).includes('edit')) {
      this.route.paramMap
      .pipe(
        switchMap((params: any) => {
          this.discId = +params.get("id");
          return forkJoin (
          this.discountsService.getDiscountById(this.discId, {}),
          this.discountsService.getPointsOfSalesByDiscountId(this.discId)
          );
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(([discount, points]) => {
        console.log(discount)
        console.log(points)
        this.newDiscountForm.patchValue({
          vendorName: discount.vendorName,
          discountName: discount.discountName,
          description: discount.description,
          discountAmount: discount.discountAmount,
          promoCode: discount.promoCode,
          startDate: discount.startDate,
          endDate: discount.endDate,
          pointOfSales: points
        });
  
        if(discount.tags) {
          for(let tag of discount.tags){
            (<FormArray>this.newDiscountForm.get('tags')).push(
              new FormControl(tag, Validators.required)
            )
          }
        }
        //todo 
      //  console.log(this.pointOfSalesForms.value)
      //   if(points) {
      //     for(let point of points) {
      //       (<FormArray>this.newDiscountForm.get('pointOfSales')).push(
      //       (new FormControl(point, Validators.required)))
      //     }
      //   }
      //   console.log(this.pointOfSalesForms.value)
      })
    }else this.addPoint();
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
    if (this.vendorsList && this.vendorsList.find(item => item.vendorName.includes(selection))) {
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
    const point = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
    this.pointOfSalesForms.push(point);
    console.log(this.pointOfSalesForms.value)
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

  submit(): void {
    const reqDiscountModel: Discount = this.newDiscountForm.value;
    console.log(reqDiscountModel)
    if ((this.router.url).includes('edit')) {
      const updateDiscount: Discount = reqDiscountModel;
      this.discountsService.updateDiscount(updateDiscount, this.discId).subscribe();
      console.log(updateDiscount)
    } else {
      const newDiscount: Discount = reqDiscountModel;
      this.discountsService.createDiscount(newDiscount)
        .subscribe(res => console.log('res', res));
    }
    this.newDiscountForm.reset();
    for (const control in this.newDiscountForm.controls) {
      this.newDiscountForm.controls[control].setErrors(null);
    }
    this.pointOfSalesForms.controls = [];
    this.tags.controls = [];
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
    this.subscription.unsubscribe();
  }
}

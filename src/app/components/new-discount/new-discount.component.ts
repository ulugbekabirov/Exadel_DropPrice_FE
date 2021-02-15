import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
  FormArrayName,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DiscountsService } from '../../services/discounts.service';

import { Vendor } from '../../models';

import { startWith, debounceTime, filter} from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MapComponent } from './../map/map.component';
import { ActivatedRoute } from '@angular/router';
import { Discount } from './../../models/discount';
import { TestService } from './../../test.service';

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

  vendorsList: Vendor[];
  filteredList: Vendor[];
  private subscription: Subscription;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocompleteModule;

  constructor(
    public translateService: TranslateService,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private discountService: DiscountsService,
    private route: ActivatedRoute,
    private testService: TestService
  ) {}

  ngOnInit(): void {

    this.subscription = this.discountService.getVendors()
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
    this.addPoint();
    this.vendorNameDetectChanges();
    this.route.paramMap.subscribe(params => {
      const discId = +params.get('id');
      if(discId) {
        this.getDiscount(discId);
      }
    })
  }

  getDiscount(id:number) {
    this.discountService.getDiscountById(id, {}).subscribe(
      (discount: Discount) =>{
        this.editDiscount(discount);
        this.discount = discount;
      },
      (err:any) => console.log(err)
    );
  }

  editDiscount(discount: Discount) {
    //  setTimeout(() => {
    //   this.newDiscountForm.setValue({
    //     vendorName: discount.vendorName,
    //     discountName: discount.discountName,
    //     description: discount.description,
    //     discountAmount: discount.discountAmount,
    //     activityStatus: true,
    //     promoCode: discount.promoCode,
    //     startDate: discount.startDate,
    //     endDate: discount.endDate,
    //     tags: discount.tags,
    //     pointOfSales: [{name: "AKkd", adress:"afafa"}]
    //   });
    // }, 10000);
   
  //   this.newDiscountForm.patchValue({
  //     vendorName: discount.vendorName,
  //     discountName: discount.discountName,
  //     description: discount.description,
  //     discountAmount: discount.discountAmount,
  //     promoCode: discount.promoCode,
  //     startDate: discount.startDate,
  //     endDate: discount.endDate,
  //   });
  //  console.log(this.newDiscountForm.value);
  //  console.log(discount.tags);
  //  this.tags.setValue(discount.tags)


  this.newDiscountForm.patchValue({
        vendorName: discount.vendorName,
        discountName: discount.discountName,
        description: discount.description,
        discountAmount: discount.discountAmount,
        promoCode: discount.promoCode,
        startDate: discount.startDate,
        endDate: discount.endDate,    
      });
      // console.log(discount.tags);
      
      // let i = 0;
      
      // for (let tag of discount.tags) {
      //   let tagsArray = <FormArray>this.newDiscountForm.controls["tags"];
      //   console.log(tagsArray)
      //   tagsArray.controls[i].patchValue(tag);
      //   i++;
      // }
   
      // let i = 0;
      //  for (let tag of discount.tags) {
      //   let newTags = this.newDiscountForm.get("newTags") as FormArray;
      //   console.log(newTags.setControl(i, new FormControl("")));
      //   i++;
      //  }
     

  }

  updateDiscount(){
   
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
    const newDiscount = this.newDiscountForm.value;
    this.discountService.postDiscount(newDiscount)
      .subscribe(res => console.log('res', res));
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

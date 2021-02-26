import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl, FormArray,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { forkJoin, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapComponent } from '../../../components/map/map.component';
import { Discount } from '../../../models';
import { DiscountsService } from '../../../services/discounts.service';
import { VendorsService } from '../../../services/vendors.service';
import { Vendor } from '../../../models/vendor';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-new-vendor',
  templateUrl: './new-vendor.component.html',
  styleUrls: ['./new-vendor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewVendorComponent implements OnInit, OnDestroy {
  newVendorForm: FormGroup;
  vendor: Vendor;
  vendId: any;
  private unsubscribe$ = new Subject<void>();
  isEditMode: boolean = (this.router.url).includes('edit');
  coordinateIsEmpty = true;
  filteredPointNameList: Discount[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private discountService: DiscountsService,
    private vendorsService: VendorsService,
    private router: Router,
    private location: Location,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.newVendorForm = this.fb.group({
      vendorName: ['', [Validators.required]],
      address: [''],
      description: [''],
      phone: ['',
        [
          Validators.required,
          Validators.pattern(/^((8|\+7|\+3|\+9|)*\d{0,3}[\- ]?)*\d{0,3}?(\(?\d{1,3}\)?[\- ]?)?[\d\- ]{7,10}$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      pointOfSales: this.fb.array([]),
      socialLinks: this.fb.group({
        instagram: ['',
          [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]
        ],
        facebook: ['',
          [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]
        ],
        webSite: ['',
          [Validators.pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)]
        ]
      })
    });

    if (this.isEditMode) {
      this.route.paramMap
        .pipe(
          switchMap((params: any) => {
            this.vendId = +params.get('id');
            return forkJoin(
              this.vendorsService.getVendorById(this.vendId),
              this.vendorsService.getVendorPointsOfSales(this.vendId)
            );
          }),
          takeUntil(this.unsubscribe$)
        ).subscribe(([vendor, points]) => {
        const editingVendor = {
          ...vendor,
          pointOfSales: points,
          socialLinks: vendor.socialLinks ? JSON.parse(vendor.socialLinks) : {}
        };
        if (editingVendor.pointOfSales) {
          editingVendor.pointOfSales.forEach(point => {
            this.pointOfSalesForms.push(this.editPointOfSale());
          });
        }
        console.log(editingVendor)
        this.newVendorForm.patchValue(editingVendor);
        this.coordinateIsEmpty = false;
        this.newVendorForm.markAsPristine();
      });
    }
  }

  editPointOfSale(): FormGroup {
    return this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      checked: [''],
    });
  }

  addPoint(): void {
    const point = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      checked: [''],
    });
    this.pointOfSalesForms.push(point);
  }

  deletePoint(currentSaleObj): void {
    this.pointOfSalesForms.removeAt(currentSaleObj);
    this.coordinateIsEmpty = true;
  }

  successSnackBar(message: string, action: any): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['snackbar-color-success']
    });
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


  errorSnackBar(message: string, action: any): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['snackbar-color-error']
    });
  }

  onSubmit(): void {
    const vendor = this.newVendorForm.value;
    const vendorModel = {...vendor, socialLinks: JSON.stringify(vendor.socialLinks)};
    if (this.isEditMode) {
      console.log('UPDATE', vendorModel);
      this.updateVendor(vendorModel, this.vendId);
    } else {
      console.log('NEW_VENDOR', vendorModel);
      this.createNewVendor(vendorModel);
    }
    this.pointOfSalesForms.clear();
  }

  private updateVendor(vendor, vendId): void {
    this.vendorsService.updateVendor(vendor, vendId).pipe(
      takeUntil(this.unsubscribe$),
      catchError(error => {
        this.errorSnackBar('Not saved!', '');
        return throwError(error);
      }))
      .subscribe((res) => {
        this.newVendorForm.reset();
        this.successSnackBar('Successfully update!', '');
        for (const control in this.newVendorForm.controls) {
          this.newVendorForm.controls[control].setErrors(null);
        }
        this.router.navigate(['/vendors', res.id]);
      });
  }

  private createNewVendor(vendor): void {
    this.vendorsService.createVendor(vendor).pipe(
      takeUntil(this.unsubscribe$),
      catchError(error => {
        this.errorSnackBar('Not saved!', '');
        return throwError(error);
      }))
      .subscribe(() => {
        this.newVendorForm.reset();
        this.successSnackBar('Successfully saved!', '');
        for (const control in this.newVendorForm.controls) {
          this.newVendorForm.controls[control].setErrors(null);
        }
      });
  }

  get description(): AbstractControl {
    return this.newVendorForm.get('description');
  }

  get phone(): AbstractControl {
    return this.newVendorForm.get('number');
  }

  get email(): AbstractControl {
    return this.newVendorForm.get('email');
  }

  get socialLinks(): AbstractControl {
    return this.newVendorForm.get('socialLinks');
  }

  get instagram(): AbstractControl {
    return this.newVendorForm.get('instagram');
  }

  get facebook(): AbstractControl {
    return this.newVendorForm.get('facebook');
  }

  get webSite(): AbstractControl {
    return this.newVendorForm.get('webSite');
  }

  get otherLinks(): AbstractControl {
    return this.newVendorForm.get('otherLinks');
  }

  get name(): AbstractControl {
    return this.pointOfSalesForms.get('name');
  }

  get address(): AbstractControl {
    return this.pointOfSalesForms.get('address');
  }

  get checked(): AbstractControl {
    return this.pointOfSalesForms.get('checked');
  }

  get pointOfSalesForms(): FormArray {
    return this.newVendorForm.get('pointOfSales') as FormArray;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

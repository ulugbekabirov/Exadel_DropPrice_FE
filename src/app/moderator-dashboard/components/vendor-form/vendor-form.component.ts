import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl, FormArray, ValidationErrors
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { forkJoin, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapComponent } from '../../../components/map/map.component';
import { DiscountsService } from '../../../services/discounts.service';
import { VendorsService } from '../../../services/vendors.service';
import { Vendor } from '../../../models/vendor';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss'],
})

export class VendorFormComponent implements OnInit, OnDestroy {
  vendorForm: FormGroup = this.fb.group({
    vendorName: ['', [Validators.required]],
    address: ['', [Validators.required]],
    description: ['', [Validators.required]],
    phone: ['',
      [
        Validators.required,
        Validators.pattern(/^([+]?[0-9\s-\(\)]{3,25})*$/),
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
  vendor: Vendor;
  vendorId: number;
  private unsubscribe$ = new Subject<void>();
  isEditMode: boolean = (this.router.url).includes('edit');
  hasUnsavedChanges = false;
  coordinateIsEmpty = true;

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
    if (this.isEditMode) {
      this.route.paramMap
        .pipe(
          switchMap((params: any) => {
            this.vendorId = +params.get('id');
            return forkJoin(
              this.vendorsService.getVendorById(this.vendorId),
              this.vendorsService.getVendorPointsOfSales(this.vendorId)
            );
          }),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(([vendor, points]) => {
          const editingVendor = {
            ...vendor,
            pointOfSales: points,
            socialLinks: vendor.socialLinks ? JSON.parse(vendor.socialLinks) : {}
          };
          this.patchPointsOfSales(points);
          this.vendorForm.patchValue(editingVendor);
          this.coordinateIsEmpty = false;
          this.hasUnsavedChanges = true;
          this.vendorForm.markAsPristine();
        });
    }
  }

  patchPointsOfSales(points): void {
    this.pointOfSalesForm.clear();
    const initPointsOfSales = {
      pointOfSales: points
    };
    initPointsOfSales.pointOfSales.forEach(point => {
      this.addPointOfSales(point);
    });
    this.vendorForm.patchValue(initPointsOfSales);
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
    });
  }

  deletePoint(currentSaleObj): void {
    this.pointOfSalesForm.removeAt(currentSaleObj);
    this.coordinateIsEmpty = true;
  }

  addPoint(): void {
    const point = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
    });
    this.pointOfSalesForm.push(point);
  }

  openDialog(currentSaleObj): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = '400px';
    dialogConfig.minWidth = '100%';
    dialogConfig.direction = 'rtl';

    dialogConfig.data = {
      latitude: this.pointOfSalesForm.value[currentSaleObj].latitude,
      longitude: this.pointOfSalesForm.value[currentSaleObj].longitude,
    };
    const dialogRef = this.dialog.open(MapComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      Object.assign(this.pointOfSalesForm.value[currentSaleObj], data);
    });
    this.coordinateIsEmpty = false;
  }

  successSnackBar(message: string, action: any): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['snackbar-color-success'],
      verticalPosition: 'top'
    });
  }

  errorSnackBar(message: string, action: any): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['snackbar-color-error'],
      verticalPosition: 'top'
    });
  }

  onSubmit(): void {
    const vendor = this.vendorForm.value;
    const vendorModel = {...vendor, socialLinks: JSON.stringify(vendor.socialLinks)};
    this.hasUnsavedChanges = false;
    if (this.isEditMode) {
      this.updateVendor(vendorModel, this.vendorId);
    } else {
      this.createNewVendor(vendorModel);
    }
    this.pointOfSalesForm.clear();
  }

  private updateVendor(vendor, vendId): void {
    this.vendorsService.updateVendor(vendor, vendId).pipe(
      takeUntil(this.unsubscribe$),
      catchError(error => {
        this.errorSnackBar('Not saved!', '');
        return throwError(error);
      }))
      .subscribe((res) => {
        this.vendorForm.reset();
        this.successSnackBar('Successfully update!', '');
        this.resetControlsErrors(this.vendorForm);
        this.router.navigate(['/vendors', res.vendorId]);
      });
  }

  private createNewVendor(vendor): void {
    const {vendorId, ...newVendor} = vendor;
    this.vendorsService.createVendor(newVendor).pipe(
      takeUntil(this.unsubscribe$),
      catchError(error => {
        this.errorSnackBar('Not saved!', '');
        return throwError(error);
      }))
      .subscribe((res) => {
        this.vendorForm.reset();
        this.successSnackBar('Successfully saved!', '');
        this.resetControlsErrors(this.vendorForm);
        this.router.navigate(['/vendors', res.vendorId]);
      });
  }

  resetControlsErrors(form): void {
    for (const control in form.controls) {
      form.controls[control].setErrors(null);
    }
  }

  get description(): AbstractControl {
    return this.vendorForm.get('description');
  }

  get phone(): AbstractControl {
    return this.vendorForm.get('number');
  }

  get email(): AbstractControl {
    return this.vendorForm.get('email');
  }

  get socialLinks(): AbstractControl {
    return this.vendorForm.get('socialLinks');
  }

  get instagram(): AbstractControl {
    return this.vendorForm.get('instagram');
  }

  get facebook(): AbstractControl {
    return this.vendorForm.get('facebook');
  }

  get webSite(): AbstractControl {
    return this.vendorForm.get('webSite');
  }

  get otherLinks(): AbstractControl {
    return this.vendorForm.get('otherLinks');
  }

  get name(): AbstractControl {
    return this.pointOfSalesForm.get('name');
  }

  get address(): AbstractControl {
    return this.pointOfSalesForm.get('address');
  }

  get checked(): AbstractControl {
    return this.pointOfSalesForm.get('checked');
  }

  get pointOfSalesForm(): FormArray {
    return this.vendorForm.get('pointOfSales') as FormArray;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
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
import { DiscountsService } from '../../../services/discounts/discounts.service';
import { VendorsService } from '../../../services/vendors/vendors.service';
import { Vendor } from '../../../models/vendor';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
    pointOfSales: this.fb.array([], [Validators.required]),
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
  @Output() changeHasUnsavedChanges = new EventEmitter();
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
    private translate: TranslateService
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
          const socialLinks = JSON.parse(vendor.socialLinks);
          for (const key in socialLinks) {
            if (socialLinks[key]) {
              socialLinks[key] = socialLinks[key].trim();
            }
          }
          const editingVendor = {
            ...vendor,
            pointOfSales: points,
          };
          this.patchPointsOfSales(points);
          this.vendorForm.patchValue(editingVendor);
          this.vendorForm.patchValue({
            socialLinks: {
              instagram: (socialLinks.instagram),
              facebook: (socialLinks.facebook),
              website: (socialLinks.webSite),
            }
          });
          this.coordinateIsEmpty = false;
          this.vendorForm.markAsPristine();
          this.hasUnsavedChanges = false;
        });
    } else {
      this.vendorForm.valueChanges.pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(() => {
        this.hasUnsavedChanges = true;
        this.changeHasUnsavedChanges.emit(true);
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
  }

  addPoint(): void {
    const point = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
    });
    this.pointOfSalesForm.push(point);
  }

  openDialog(currentSaleObj): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = '500px';
    dialogConfig.minWidth = '100%';

    dialogConfig.data = this.pointOfSalesForm.controls[currentSaleObj];
    const dialogRef = this.dialog.open(MapComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        if (data) {
          this.pointOfSalesForm.controls[currentSaleObj].patchValue(data);
        }
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
    this.changeHasUnsavedChanges.emit(false);
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
        this.errorSnackBar(this.translate.instant('NEW_DISCOUNT_FORM.ERROR_UPDATE_SNACKBAR'), '');
        return throwError(error);
      }))
      .subscribe((res) => {
        this.vendorForm.reset();
        this.successSnackBar(this.translate.instant('NEW_DISCOUNT_FORM.SUCCESS_UPDATE_SNACKBAR'), '');
        this.resetControlsErrors(this.vendorForm);
        this.router.navigate(['/vendors', res.vendorId]);
      });
  }

  private createNewVendor(vendor): void {
    const {vendorId, ...newVendor} = vendor;
    this.vendorsService.createVendor(newVendor).pipe(
      takeUntil(this.unsubscribe$),
      catchError(error => {
        this.errorSnackBar(this.translate.instant('NEW_DISCOUNT_FORM.ERROR_SAVE_SNACKBAR'), '');
        return throwError(error);
      }))
      .subscribe((res) => {
        this.vendorForm.reset();
        this.successSnackBar(this.translate.instant('NEW_DISCOUNT_FORM.SUCCESS_SAVE_SNACKBAR'), '');
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

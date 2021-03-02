import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { Discount } from '../../../models';
import { DiscountsService } from '../../../services/discounts.service';
import { VendorsService } from '../../../services/vendors.service';

@Component({
  selector: 'app-moderator-dashboard',
  templateUrl: './moderator-dashboard.component.html',
  styleUrls: ['./moderator-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModeratorDashboardComponent {
  private unsubscribe$ = new Subject<void>();

  constructor(
    private discountsService: DiscountsService,
    private vendorsService: VendorsService,
    private messageService: MatSnackBar
  ) {
  }

  // createDiscount(discount: Discount) {
  //   this.discountsService.createDiscount(discount).pipe(
  //     takeUntil(this.unsubscribe$),
  //     catchError(error => {
  //       this.errorSnackBar('Not saved', '');
  //       return throwError(error);
  //     })
  //   )
  //     .subscribe((res) => {
  //       this.discountForm.reset();
  //       this.successSnackBar('Successfully saved!', '');
  //       for (const control in this.discountForm.controls) {
  //         this.discountForm.controls[control].setErrors(null);
  //       }
  //       this.router.navigate(['/vendors', res.vendorId]);
  //     });
  // }
  //
  // successSnackBar(message: string, action: any): void {
  //   this.messageService.open(message, action, {
  //     duration: 3000,
  //     panelClass: ['snackbar-color-success'],
  //     horizontalPosition: 'center',
  //     verticalPosition: 'top'
  //   });
  // }
  //
  // errorSnackBar(message: string, action: any): void {
  //   this.messageService.open(message, action, {
  //     duration: 3000,
  //     panelClass: ['snack-bar-color-error'],
  //     horizontalPosition: 'center',
  //     verticalPosition: 'top'
  //   });
  // }
  //
  // ngOnDestroy(): void {
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  // }
}

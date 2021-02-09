import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountsService } from '../../../services/discounts.service';
import { Vendor } from '../../../models';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit, OnDestroy {
  vendor: Vendor;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discountsService: DiscountsService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params): Observable<Vendor> => {
          return this.discountsService.getVendorById(+params.get('id'));
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe((vendor: Vendor) => {
        if (!vendor) {
          return;
        }
        this.vendor = vendor;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

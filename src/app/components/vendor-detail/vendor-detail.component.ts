import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountsService } from '../../services/discounts.service';
import { Vendor } from '../../models';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit, OnDestroy {
  vendor: Vendor;
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discountsService: DiscountsService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.route.paramMap
      .pipe(
        switchMap((params): Observable<Vendor> => {
          return this.discountsService.getVendorById(+params.get('id'));
        })
      ).subscribe(data => {
        this.vendor = data;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

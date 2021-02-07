import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountsService } from '../../services/discounts.service';
import { Vendor } from '../../models';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit {
  vendor: Vendor;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discountsService: DiscountsService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          return this.discountsService.getVendorById(+params.get('id'));
        })
      ).subscribe(data => {
        this.vendor = data;
        console.log('VENDOR', this.vendor);
    });
  }

}

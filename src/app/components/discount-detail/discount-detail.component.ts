import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DiscountsService } from '../../services/discounts.service';
import { Discount } from '../../models';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-discount-detail',
  templateUrl: './discount-detail.component.html',
  styleUrls: ['./discount-detail.component.scss']
})
export class DiscountDetailComponent implements OnInit, OnDestroy {

  discount: Discount;
  subscription: Subscription;
  activeUser;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discountsService: DiscountsService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.route.paramMap
      .pipe(
        switchMap((params): Observable<Discount> => {
          return this.discountsService.getDiscountById(+params.get('id'));
        })
      ).subscribe(data => this.discount = data);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

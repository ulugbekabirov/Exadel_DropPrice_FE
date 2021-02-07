import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DiscountsService } from '../../services/discounts.service';
import { Discount } from '../../models';

@Component({
  selector: 'app-discount-detail',
  templateUrl: './discount-detail.component.html',
  styleUrls: ['./discount-detail.component.scss']
})
export class DiscountDetailComponent implements OnInit {

  discount: Discount;

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
          return this.discountsService.getDiscountById(+params.get('id'));
        })
      ).subscribe(data => this.discount = data);
  }

}

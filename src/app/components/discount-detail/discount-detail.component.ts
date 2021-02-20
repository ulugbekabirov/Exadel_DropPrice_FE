import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DiscountsService } from '../../services/discounts.service';
import { Discount } from '../../models';
import { Observable, Subject } from 'rxjs';
import { RefDirective } from '../../directives/ref.directive';
import { UserService } from '../../services/user.service';
import { UserFacadeService } from '../../user-profile/services/user-facade.service';

@Component({
  selector: 'app-discount-detail',
  templateUrl: './discount-detail.component.html',
  styleUrls: ['./discount-detail.component.scss']
})

export class DiscountDetailComponent implements OnInit, OnDestroy {

  discount: Discount;
  private unsubscribe$ = new Subject<void>();
  rating;
  reqOpt = {
    skip: 0,
    take: 10,
    longitude: this.userService.activeUserValue.officeLongitude,
    latitude: this.userService.activeUserValue.officeLatitude,
  };
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRatingValue = 0;

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discountsService: DiscountsService,
    private userFacade: UserFacadeService,
    private location: Location,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params): Observable<Discount> => {
          return this.discountsService.getDiscountById(+params.get('id'), this.reqOpt);
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe((discount: Discount) => {
      if (!discount) {
        return;
      }
      this.discount = discount;
      const lengthRating = this.discount.discountRating ? Number(this.discount.discountRating.toFixed()) : 0;
      this.rating = new Array(lengthRating).fill('star');
    });
  }

  ticketHandler(discountId: number): void {
    this.userFacade.orderTicket(discountId, this.refDir);
  }

  toggleFavorites(discountId: number): void {
    this.discountsService.updateIsSavedDiscount(discountId).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(resp => {
      this.discount = {...this.discount, isSaved: resp.isSaved};
    });
  }

  archiveDiscount(discountId: number): void {
    this.discountsService.putDiscountInArchive(discountId).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(resp => {
        this.discount = {...this.discount, activityStatus: resp.activityStatus};
      });
  }

  goBack(): void {
    this.location.back();
  }

  countStar(starValue): void {
    this.selectedRatingValue = starValue;
    this.discountsService.putRating(this.discount.discountId, this.selectedRatingValue).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(next => {
        this.selectedRatingValue = 0;
      });
  }

  addClass(star): void {
    let ab = '';
    for (let i = 0; i < star; i++) {
      ab = 'starId' + i;
      document.getElementById(ab).classList.add('selected');
    }
  }

  removeClass(star): void {
    let ab = '';
    for (let i = star - 1; i >= this.selectedRatingValue; i--) {
      ab = 'starId' + i;
      document.getElementById(ab).classList.remove('selected');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

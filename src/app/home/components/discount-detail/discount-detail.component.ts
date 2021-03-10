import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Discount } from '../../../models';
import { Observable, Subject } from 'rxjs';
import { RefDirective } from '../../../directives/ref/ref.directive';
import { PointOfSales } from '../../../models/point-of-sales';
import { DiscountsFacadeService } from '../../services/discounts-facade.service';
import { DiscountsRequestStore } from '../../services/discounts-request-store';
import { DiscountsStore } from '../../services/discounts-store';


@Component({
  selector: 'app-discount-detail',
  templateUrl: './discount-detail.component.html',
  styleUrls: ['./discount-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DiscountDetailComponent implements OnInit, OnDestroy {
  discount$: Observable<Discount>;
  pointsOfSales$: Observable<PointOfSales[]>;
  locationSelected$;
  discount;
  discountId: number;
  private unsubscribe$ = new Subject<void>();
  rating;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRatingValue = 0;

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private facade: DiscountsFacadeService,
    private store: DiscountsStore,
    private sortStore: DiscountsRequestStore,

  ) {
    this.discount$ = this.store.select('activeDiscount');
    this.pointsOfSales$ = this.store.select('pointsOfSales');
    this.locationSelected$ = this.sortStore.select('location');
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params): Observable<any> => {
          this.discountId = +params.get('id');
          return this.facade.loadDiscountData(this.discountId);
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe();

  }

  ticketHandler(discountId: number): void {
    this.facade.requestTicket(discountId, this.refDir);
  }

  toggleFavorites(discountId: number): void {
    this.facade.toggleFavourites(discountId).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(resp => {
      const activeDiscount = this.store.value.activeDiscount;
      const discount = {...activeDiscount, isSaved: resp.isSaved};
      this.store.set('activeDiscount', discount);
    });
  }

  onEditDiscount(discountId): void {
    this.router.navigate(['add-new/discounts/edit', discountId]);
  }

  archiveDiscount(discountId: number): void {
    this.facade.putArchiveDiscount(discountId).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(resp => {
      const activeDiscount = this.store.value.activeDiscount;
      const discount = {...activeDiscount, activityStatus: resp.activityStatus};
      this.store.set('activeDiscount', discount);
    });
  }

  goBack(): void {
    this.location.back();
  }

  countStar(starValue): void {
    this.selectedRatingValue = starValue;
    this.facade.putRating(this.discountId, this.selectedRatingValue).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(next => {
      if (!next && !next.assessmentValue) {
        this.selectedRatingValue = 0;
      } else {
        this.selectedRatingValue = next.assessmentValue;
      }
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
    this.store.set('activeDiscount', {});
  }
}

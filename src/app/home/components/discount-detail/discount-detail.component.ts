import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Discount } from '../../../models';
import { Observable, Subject } from 'rxjs';
import { RefDirective } from '../../../directives/ref.directive';
import { HomeFacadeService } from '../../services/home-facade.service';
import { HomeStore } from '../../services/home-store';


@Component({
  selector: 'app-discount-detail',
  templateUrl: './discount-detail.component.html',
  styleUrls: ['./discount-detail.component.scss']
})

export class DiscountDetailComponent implements OnInit, OnDestroy {
  discount$: Observable<Discount>;
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
    private facade: HomeFacadeService,
    private store: HomeStore,
  ) {
    this.discount$ = this.store.select('activeDiscount');
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params): Observable<any> => {
          this.discountId = +params.get('id');
          return this.facade.getDiscount(this.discountId);
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

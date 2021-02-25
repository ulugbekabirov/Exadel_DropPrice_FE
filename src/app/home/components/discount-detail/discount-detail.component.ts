import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DiscountsService } from '../../../services/discounts.service';
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
    private discountsService: DiscountsService,
    private location: Location,
    private facade: HomeFacadeService,
    private store: HomeStore,
  ) {
  }

  ngOnInit(): void {
    this.discount$ = this.route.paramMap
      .pipe(
        switchMap((params): Observable<Discount> => {
          this.discountId = +params.get('id');
          return this.facade.getDiscount(this.discountId).pipe(
            switchMap((): Observable<Discount> => {
              return this.store.select('activeDiscount');
            })
          );
        }),
      );
  }

  ticketHandler(discountId: number): void {
    this.facade.requestTicket(discountId, this.refDir);
  }

  toggleFavorites(discountId: number): void {
    this.facade.toggleFavourites(discountId);
  }

  onEditDiscount(discountId): void {
    this.router.navigate(['add-new/discounts/edit', discountId]);
  }

  archiveDiscount(discountId: number): void {
    this.facade.putArchiveDiscount(discountId);
  }

  goBack(): void {
    this.location.back();
  }

  countStar(starValue): void {
    this.selectedRatingValue = starValue;
    this.discountsService.putRating(this.discountId, this.selectedRatingValue).pipe(
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

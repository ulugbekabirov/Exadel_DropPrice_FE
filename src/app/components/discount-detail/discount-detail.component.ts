import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DiscountsService } from '../../services/discounts.service';
import { Discount } from '../../models';
import { Observable, Subject, Subscription } from 'rxjs';
import { RefDirective } from '../../directives/ref.directive';
import { TicketComponent } from '../ticket/ticket.component';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-discount-detail',
  templateUrl: './discount-detail.component.html',
  styleUrls: ['./discount-detail.component.scss']
})
export class DiscountDetailComponent implements OnInit, OnDestroy {

  discount: Discount;
  private unsubscribe$ = new Subject<void>();
  rating;

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discountsService: DiscountsService,
    private ticketService: TicketService,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params): Observable<Discount> => {
          return this.discountsService.getDiscountById(+params.get('id'));
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(discount => {
      if (!discount) {
        return;
      }
      this.discount = discount;
      console.log('discount', discount);
      this.rating = new Array(Number(this.discount.discountRating)).fill('star');
    });
  }

  editDiscount(discountId: number): void {

  }

  ticketHandler(discountId: number): void {
    this.ticketService.getTicket(discountId, this.refDir);
  }

  toggleFavorites(discountId: number): void {
    this.discountsService.updateIsSavedDiscount(discountId).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(resp => {
        this.discount = {...this.discount, isSaved: resp.isSaved};
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

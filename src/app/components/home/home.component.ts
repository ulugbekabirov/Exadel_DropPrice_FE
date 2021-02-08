import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DiscountsService } from 'src/app/services/discounts.service';
import { UserService } from 'src/app/services/user.service';
import { SORT_BY } from '../../../constants';
import { ActiveUser, Discount, LocationCoords, Tag, Town } from '../../models';
import { RefDirective } from '../../directives/ref.directive';
import { TicketComponent } from '../ticket/ticket.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {
  sortBy = SORT_BY;
  activeUser: ActiveUser;
  tags: Tag[];
  towns: Town[];
  discounts: Discount[];
  activeUser$: Observable<ActiveUser>;
  activeSort: string;
  activeCoords: LocationCoords;
  private subscription: Subscription;

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private discountsService: DiscountsService,
    private userService: UserService,
    private resolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit(): void {
    this.activeUser$ = this.userService.activeUser;
    this.subscription = this.activeUser$.pipe(
    ).subscribe(user => {
      this.activeUser = user;
      this.activeSort = 'DistanceAsc';
      if (user.latitude && user.longitude) {
        this.activeCoords = {
          latitude: user.latitude,
          longitude: user.longitude,
        };
      } else {
        this.activeCoords = {
          latitude: user.officeLatitude,
          longitude: user.officeLongitude,
        };
      }

    });
    const towns$ = this.discountsService.getTowns();
    const tags$ = this.discountsService.getTags(0, 20);
    const discounts$ = this.discountsService.getDiscounts(0, 5, this.activeCoords.longitude, this.activeCoords.latitude, this.activeSort);
    forkJoin(
      [towns$, tags$, discounts$]
    ).pipe(
      tap(([towns, tags, discounts]) => {
      })
    ).subscribe(([towns, tags, discounts]) => {
      this.towns = towns;
      this.tags = tags;
      this.discounts = discounts;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLocationChange({value: {latitude, longitude}}): void {
    this.activeCoords = {latitude, longitude};
    this.discountsService.getDiscounts(0, 5, this.activeCoords.longitude, this.activeCoords.latitude, this.activeSort)
      .subscribe(res => this.discounts = res);
  }

  onSortChange({value: {sortBy}}): void {
    this.activeSort = sortBy;
    this.discountsService.getDiscounts(0, 5, this.activeCoords.longitude, this.activeCoords.latitude, this.activeSort)
      .subscribe(res => this.discounts = res);
  }

  getTicket(discountId): void {
    const ticketFactory = this.resolver.resolveComponentFactory(TicketComponent);
    this.refDir.containerRef.clear();
    this.discountsService.getTicket(discountId)
      .subscribe(ticket => {
        component.instance.ticket = ticket;
      });
    const component = this.refDir.containerRef.createComponent(ticketFactory);
    component.instance.closeTicket.subscribe(() => {
      this.refDir.containerRef.clear();
    });
  }

  changeFavourites(id: number): void {
    this.discountsService.updateIsSavedDiscount(id)
      .subscribe(resp => {
        this.discounts = this.discounts.map((discount: Discount) => {
          return discount.discountId === resp.discountID
            ? {...discount, isSaved: resp.isSaved}
            : {...discount};
        });
      });
  }
  search(searches) { 
    const { name, tag } = searches;
    this.discountsService.searchDiscounts(0, 10, this.activeCoords.longitude, this.activeCoords.latitude, this.activeSort, name, tag)
    .subscribe(res => this.discounts = res)
  }
}

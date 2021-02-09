import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
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
  activeCoords: LocationCoords;
  activeData = {
    skip: 0,
    take: 10,
    longitude: 0,
    latitude: 0,
    sortBy: 'DistanceAsc',
    searchQuery: '',
    tags: []
  };
  private subscription: Subscription;
  private unsubscribe$ = new Subject<void>();

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private discountsService: DiscountsService,
    private userService: UserService,
    private resolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit(): void {
    this.activeUser$ = this.userService.activeUser;
    this.activeUser$.pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(user => {
        this.activeUser = user;
        this.activeData.sortBy = 'DistanceAsc';
        this.activeData.latitude = user.officeLatitude;
        this.activeData.longitude = user.officeLongitude;
      });
    const towns$ = this.discountsService.getTowns();
    const tags$ = this.discountsService.getTags(0, 10);
    const discounts$ = this.discountsService.getDiscounts(this.activeData);
    forkJoin([towns$, tags$, discounts$]).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(([towns, tags, discounts]) => {
        console.log('теги',tags);
        this.towns = towns;
        this.tags = tags;
        this.discounts = discounts;
      });
  }

  changeCoords(): void {
    this.userService.getLocation()
      .then(res => {
        this.activeData.latitude = res.latitude;
        this.activeData.longitude = res.longitude;
      }).then(res => {
      this.discountsService.getDiscounts(this.activeData).pipe(
        takeUntil(this.unsubscribe$)
      )
        .subscribe(data => this.discounts = data);
    });
  }

  onLocationChange({value: {latitude, longitude}}): void {
    this.activeData.latitude = latitude;
    this.activeData.longitude = longitude;
    this.discountsService.getDiscounts(this.activeData).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(res => this.discounts = res);
  }

  onSortChange({value: {sortBy}}): void {
    this.activeData.sortBy = sortBy;
    this.discountsService.getDiscounts(this.activeData).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(res => this.discounts = res);
  }

  getTicket(discountId): void {
    const ticketFactory = this.resolver.resolveComponentFactory(TicketComponent);
    this.refDir.containerRef.clear();
    this.discountsService.getTicket(discountId).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(ticket => {
        component.instance.ticket = ticket;
      });
    const component = this.refDir.containerRef.createComponent(ticketFactory);
    component.instance.closeTicket.subscribe(() => {
      this.refDir.containerRef.clear();
    });
  }

  changeFavourites(id: number): void {
    this.discountsService.updateIsSavedDiscount(id).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(resp => {
        this.discounts = this.discounts.map((discount: Discount) => {
          return discount.discountId === resp.discountID
            ? {...discount, isSaved: resp.isSaved}
            : {...discount};
        });
      });
  }

  onSearchQueryChange(searches): void {
    const {name, tag} = searches;
    this.activeData.searchQuery = name;
    this.activeData.tags = [...tag];
    this.discountsService.searchDiscounts(this.activeData).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => this.discounts = res);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

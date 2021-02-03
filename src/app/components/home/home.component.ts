import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DiscountsService } from 'src/app/services/discounts.service';
import { UserService } from 'src/app/services/user.service';
import { SORT_BY } from '../../../constants';
import { ActiveUser, Discount, LocationCoords, Tag, Town } from '../../models';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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

  constructor(
    private discountsService: DiscountsService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.activeUser$ = this.userService.activeUser;
    this.subscription = this.activeUser$.pipe(
    ).subscribe(user => {
      console.log('ACTIVE_USER', user);
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
    const discounts$ = this.discountsService.getDiscounts(0, 10, this.activeCoords.longitude, this.activeCoords.latitude, this.activeSort);
    forkJoin(
      [towns$, tags$, discounts$]
    ).pipe(
      tap(([towns, tags, discounts]) => {
        console.log('res1', towns);
        console.log('res2', tags);
        console.log('res3', discounts);
      })
    ).subscribe(([towns, tags, discounts]) => {
      this.towns = towns;
      this.tags = tags;
      this.discounts = discounts;
      console.log('this', this);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLocationChange({value: {latitude, longitude}}): void {
    this.activeCoords = {latitude, longitude};
    this.discountsService.getDiscounts(0, 10, this.activeCoords.longitude, this.activeCoords.latitude, this.activeSort)
      .subscribe(res => this.discounts = res);
  }

  onSortChange({value: {sortBy}}): void {
    this.activeSort = sortBy;
    this.discountsService.getDiscounts(0, 10, this.activeCoords.longitude, this.activeCoords.latitude, this.activeSort)
      .subscribe(res => this.discounts = res);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { DiscountsService } from 'src/app/services/discounts.service';
import { UserService } from 'src/app/services/user.service';
import { SORT_BY } from '../../../constants';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  activeUser;
  tags;
  towns;
  discounts;
  private subscription: Subscription;
  activeUser$: Observable<any>;
  sortBy = SORT_BY;
  activeSort;
  activeCoords;

  constructor(
    private discountsService: DiscountsService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.activeUser$ = this.userService.activeUser;
    this.subscription = this.activeUser$.pipe(
    ).subscribe(user => this.activeUser = user);
    const towns$ = this.discountsService.getTowns();
    const tags$ = this.discountsService.getTags(0, 20);
    const discounts$ = this.discountsService.getDiscounts(0, 10, this.activeUser.officeLongitude, this.activeUser.officeLatitude, 'DistanceAsc');
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
    this.discountsService.getDiscounts(0, 10, this.activeCoords.longitude, this.activeCoords.longitude, this.activeSort)
      .subscribe(res => this.discounts = res);
  }
}

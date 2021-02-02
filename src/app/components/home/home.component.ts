import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { DiscountsService } from 'src/app/services/discounts.service';
import { UserService } from 'src/app/services/user.service';
import { log } from 'util';


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

  constructor(
    private discountsService: DiscountsService,
    private userService: UserService,
  ) {
    this.activeUser$ = this.userService.activeUser;
  }

  ngOnInit(): void {
    this.activeUser$.pipe(
    ).subscribe(user => this.activeUser = user);
    const towns$ = this.discountsService.getTowns();
    const tags$ = this.discountsService.getTags(0, 2);
    const discounts$ = this.discountsService.getDiscounts(0, 30, this.activeUser.officeLongitude, this.activeUser.officeLatitude, 'dist');
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
    // forkJoin(
    //   this.discountsService.getTowns(),
    //   this.discountsService.getTags(0, 2),
    //   this.discountsService.getDiscounts(0, 30, this.activeUser.longitude, this.activeUser.latitude, 'dist'),
    // ).pipe(
    //   tap(([towns, tags, discounts]) => {
    //     console.log('res1', towns);
    //     console.log('res2', tags);
    //     console.log('res3', discounts);
    //   })
    // ).subscribe(([towns, tags, discounts]) => {
    //   this.towns = towns;
    //   this.tags = tags;
    //   this.discounts = discounts;
    // });
  }

  onLocationChange($event: any): void {
    console.log('messaga', $event);
    this.discountsService.getDiscounts(0, 30, $event.longitude, $event.latitude, 'sortBy')
      .subscribe(res => this.discounts = res);
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}

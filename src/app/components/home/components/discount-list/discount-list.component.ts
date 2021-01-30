import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActiveUser, Discount, Tag, Town } from '../../../../models';
import { DiscountsService } from '../../../../services/discounts.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.scss']
})
export class DiscountListComponent implements OnInit, OnDestroy {
  sortSettings: string[] = ['alphabet', 'distanse', 'vendor'];
  // deafaultSetting: string = this.sortSettings[0];
  activeUser$: Observable<ActiveUser>;
  activeUser;
  tags: Tag[];
  towns: Town[];
  discounts: Discount[];
  private subscription: Subscription;

  // fakeDiscounts = [
  //   {
  //     id : 1,
  //     discount : 30,
  //     discount_name: 'Велотренажер',
  //     vendor_name : 'Sport_master',
  //     distanse : 100,
  //     date : new Date().toLocaleDateString(),
  //     rating : 4
  //   },
  //   {
  //     id : 2,
  //     discount : 50,
  //     discount_name: 'ice cream',
  //     vendor_name : 'Ice_master',
  //     distanse : 200,
  //     date : new Date().toLocaleDateString(),
  //     rating : 4
  //   },
  //   {
  //     id : 3,
  //     discount : 30,
  //     discount_name: 'Dream',
  //     vendor_name : 'Dream_master',
  //     distanse : 300,
  //     date : new Date().toLocaleDateString(),
  //     rating : 4
  //   },
  //   {
  //     id : 4,
  //     discount : 60,
  //     discount_name: 'Rick',
  //     vendor_name : 'Neutrino_bomb',
  //     distanse : 111300,
  //     date : new Date().toLocaleDateString(),
  //     rating : 4
  //   }
  // ];
  constructor(
    private discountsService: DiscountsService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.activeUser$ = this.userService.activeUser;
    this.subscription = this.activeUser$
      .subscribe(user => this.activeUser = user);
    forkJoin(
      this.discountsService.getTowns(),
      this.discountsService.getTags(0, 10),
      this.discountsService.getDiscounts(0, 10, this.activeUser.longitude, this.activeUser.latitude, 'dist'),
    ).pipe(
      tap(([res1, res2, res3]) => {
        console.log('res1', res1);
        console.log('res2', res2);
        console.log('res3', res3);
      })
    ).subscribe(([res1, res2, res3]) => {
      this.towns = res1;
      this.tags = res2;
      this.discounts = res3;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

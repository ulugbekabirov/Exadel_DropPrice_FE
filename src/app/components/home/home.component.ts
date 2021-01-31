import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActiveUser } from 'src/app/models';
import { DiscountsService } from 'src/app/services/discounts.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  activeUser$: Observable<ActiveUser>;
  activeUser;
  private subscription: Subscription;
  tags;

  constructor(
    private discountsService: DiscountsService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.activeUser$ = this.userService.activeUser;
    this.subscription = this.activeUser$
      .subscribe(user => this.activeUser = user);
    forkJoin(
      this.discountsService.getTowns(),
      this.discountsService.getTags(0, 2),
      this.discountsService.getDiscounts(0, 10, this.activeUser.officeLongitude, this.activeUser.officeLatitude, 'dist'),
    ).pipe(
      tap(([res1, res2, res3]) => {
        console.log('res1', res1);
        console.log('res2', res2);
        console.log('res3', res3);
      })
    ).subscribe(([res1, res2, res3]) => {
      this.tags = res2;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

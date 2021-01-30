import { Component, OnDestroy, OnInit } from '@angular/core';
import { DiscountsService } from '../../services/discounts.service';
import { UserService } from '../../services/user.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ActiveUser } from '../../models';
import { ApiDataService } from '../../services/api-data.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  activeUser$: Observable<ActiveUser>;
  activeUser;
  private subscription: Subscription;

  constructor(
    private discountsService: DiscountsService,
    private userService: UserService,
    private restApi: ApiDataService,
  ) {
  }

  ngOnInit(): void {
    this.activeUser$ = this.userService.activeUser;
    this.subscription = this.activeUser$
      .subscribe(user => this.activeUser = user);
    forkJoin(
      this.restApi.getTowns(),
      this.restApi.getTags(0, 10),
      this.discountsService.getDiscounts(0, 10, this.activeUser.longitude, this.activeUser.latitude, 'dist'),
    ).pipe(
      tap(([res1, res2, res3]) => {
        console.log('res1', res1);
        console.log('res2', res2);
        console.log('res3', res3);
      })
    ).subscribe(x => console.log('x', x));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

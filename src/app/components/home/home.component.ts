import { Component, OnDestroy, OnInit } from '@angular/core';
import { DiscountsService } from '../../services/discounts.service';
import { UserService } from '../../services/user.service';
import { Observable, Subscription } from 'rxjs';
import { ActiveUser } from '../../models';
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
  ) {}

  ngOnInit(): void {
    this.activeUser$ = this.userService.activeUser;
    this.subscription = this.activeUser$
      .subscribe(user => this.activeUser = user);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

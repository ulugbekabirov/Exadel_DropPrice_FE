import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActiveUser } from '../../models';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private activeUser: ActiveUser;

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.userService.activeUser
      .pipe()
      .subscribe(data => this.activeUser = data);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';
import { ActiveUser } from '../../models';

@Directive({
  selector: '[appVerifyUserRoles]'
})
export class VerifyUserRolesDirective implements OnInit, OnDestroy {
  @Input() appVerifyUserRoles: string[];
  private subscription: Subscription;
  activeUser$: Observable<ActiveUser>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.activeUser$ = this.userService.activeUser$;
    this.subscription = this.activeUser$
      .pipe(
        pluck('roles'),
      )
      .subscribe(roles => {
        if (!this.activeUser$ || !roles || roles.length === 0) {
          return this.viewContainerRef.clear();
        }
        const index = roles.findIndex((element) => this.appVerifyUserRoles.indexOf(element) !== -1);
        if (index < 0) {
          return this.viewContainerRef.clear();
        } else {
          return this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

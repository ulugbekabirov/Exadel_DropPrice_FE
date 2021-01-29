import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Directive({
  selector: '[appVerifyUserRoles]'
})
export class VerifyUserRolesDirective implements OnInit, OnDestroy {
  @Input() appVerifyUserRoles: string[];
  private subscription: Subscription;
  activeUser$: Observable<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.activeUser$ = this.auth.activeUser;

    this.subscription = this.activeUser$
      .pipe(
        pluck('userRole'),
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

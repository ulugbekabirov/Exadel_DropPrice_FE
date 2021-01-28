import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Directive({
  selector: '[appVerifyUserRoles]'
})
export class VerifyUserRolesDirective implements OnInit, OnDestroy {
  @Input() appVerifyUserRoles: string[];
  private subscription: Subscription;
  activeUser$ = this.auth.activeUser;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.activeUser$
      .pipe(
        pluck('userRole'),
        tap(x => console.log('DIRECTIVE', x))
      )
      .subscribe(roles => {
        if (!this.activeUser$ || !roles || roles.length === 0) {
          this.viewContainerRef.clear();
        }
        const index = roles.findIndex((element) => this.appVerifyUserRoles.indexOf(element) !== -1);
        if (index < 0) {
          this.viewContainerRef.clear();
        } else {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

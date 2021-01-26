import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appVerifyUserRoles]'
})
export class VerifyUserRolesDirective implements OnInit, OnDestroy {
  @Input('appVerifyUserRoles') ifRoles: string[];
  private subscription: Subscription[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.subscription.push(
      this.rolesService.getRol
        .subscribe(res => {
          if (!res.userRole) {
            this.viewContainerRef.clear();
          }
          if (this.ifRoles) {
            const index: number = res.userRole.findIndex((element: string): boolean => this.ifRoles.indexOf(element) !== -1);
            index > 0 ? this.viewContainerRef.createEmbeddedView(this.templateRef) : this.viewContainerRef.clear();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UnsavedChangesGuard } from '../guards/unsaved-changes/unsaved-changes.guard';
import { ModeratorDashboardComponent } from './components/moderator-dashboard/moderator-dashboard.component';
import { VendorFormComponent } from './components/vendor-form/vendor-form.component';
import { AuthGuard } from '../guards/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { DiscountFormComponent } from './components/discount-form/discount-form.component';
import { EditSessionComponent } from './components/edit-session/edit-session.component';

const routes: Routes = [
  {
    path: '',
    component: ModeratorDashboardComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: 'discounts/edit/:id',
    component: DiscountFormComponent,
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: 'vendors/edit/:id',
    component: VendorFormComponent,
    canDeactivate: [UnsavedChangesGuard]
  },
];


@NgModule({
  declarations: [
    ModeratorDashboardComponent,
    VendorFormComponent,
    DiscountFormComponent,
    EditSessionComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class ModeratorDashboardModule {
}

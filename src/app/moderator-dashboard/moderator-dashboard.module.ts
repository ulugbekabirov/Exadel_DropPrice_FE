import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModeratorDashboardComponent } from './components/moderator-dashboard/moderator-dashboard.component';
import { NewVendorComponent } from './components/new-vendor/new-vendor.component';
import { AuthGuard } from '../guards/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { DiscountFormComponent } from './components/discount-form/discount-form.component';

const routes: Routes = [
  {path: '',
    component: ModeratorDashboardComponent,
    canActivate: [AuthGuard],
  },
  {path: 'discounts/edit/:id', component: DiscountFormComponent},
  {path: 'vendors/edit/:id', component: NewVendorComponent},
];


@NgModule({
  declarations: [
    ModeratorDashboardComponent,
    NewVendorComponent,
    DiscountFormComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports: [
    RouterModule
  ]
})
export class ModeratorDashboardModule {
}

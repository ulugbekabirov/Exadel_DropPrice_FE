import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModeratorDashboardComponent } from './components/moderator-dashboard/moderator-dashboard.component';
import { NewDiscountComponent } from './components/new-discount/new-discount.component';
import { NewVendorComponent } from './components/new-vendor/new-vendor.component';
import { AuthGuard } from '../guards/auth.guard';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {path: '',
    component: ModeratorDashboardComponent,
    canActivate: [AuthGuard],
  },
  {path: 'discounts/edit/:id', component: NewDiscountComponent},
  {path: 'vendors/edit/:id', component: NewVendorComponent},
];


@NgModule({
  declarations: [
    ModeratorDashboardComponent,
    NewDiscountComponent,
    NewVendorComponent
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

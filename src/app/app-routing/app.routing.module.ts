import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { NotFoundComponent } from '../shared/components/not-found.components/not-found.component';
import { HomeComponent } from '../components/home/home.component';
import { AuthGuard } from '../guards/auth.guard';
import { DiscountDetailComponent } from '../components/discount-detail/discount-detail.component';
import { ModeratorDashboardComponent } from '../components/moderator-dashboard/moderator-dashboard.component';
import { NewVendorComponent } from '../components/new-vendor/new-vendor.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {path: 'discounts/:id', component: DiscountDetailComponent},
  {path: 'login', component: LoginFormComponent},
  {path: 'vendors', loadChildren: () => import('../vendors/vendors.module').then(m => m.VendorsModule)},
  {path: 'user-profile', loadChildren: () => import('../user-profile/user-profile.module').then(m => m.UserProfileModule)},
  {path: 'statistics', loadChildren: () => import('../admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)},
  {path: 'add-new',
    component: ModeratorDashboardComponent,
    canActivate: [AuthGuard],
  },
  {path: 'vendors/edit/:id', component: NewVendorComponent},
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

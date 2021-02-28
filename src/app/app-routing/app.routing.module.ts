﻿import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { NotFoundComponent } from '../shared/components/not-found.components/not-found.component';
import { HomeComponent } from '../components/home/home.component';
import { AuthGuard } from '../guards/auth.guard';
import { DiscountDetailComponent } from '../components/discount-detail/discount-detail.component';

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
  {path: 'admin', loadChildren: () => import('../admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)},
  {path: 'add-new', loadChildren: () => import('../moderator-dashboard/moderator-dashboard.module').then(m => m.ModeratorDashboardModule)},
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
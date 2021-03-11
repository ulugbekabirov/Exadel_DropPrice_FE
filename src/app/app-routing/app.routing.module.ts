import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { NotFoundComponent } from '../shared/components/not-found.components/not-found.component';

const appRoutes: Routes = [
  {path: '', loadChildren: () => import('../home/home.module').then(m => m.HomeModule)},
  {path: 'login', loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)},
  {path: 'vendors', loadChildren: () => import('../vendors/vendors.module').then(m => m.VendorsModule)},
  {path: 'user-profile', loadChildren: () => import('../user-profile/user-profile.module').then(m => m.UserProfileModule)},
  {path: 'admin', loadChildren: () => import('../admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)},
  {path: 'add-new', loadChildren: () => import('../moderator-dashboard/moderator-dashboard.module').then(m => m.ModeratorDashboardModule)},
  {path: '', redirectTo: '/discounts', pathMatch: 'full'},
  {
    path: '**',
    component: NotFoundComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

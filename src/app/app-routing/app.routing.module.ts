import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { NotFoundComponent } from '../shared/components/not-found.components/not-found.component';
import { HomeComponent } from '../components/home/home.component';
import { AuthGuard } from '../guards/auth.guard';
import { DiscountDetailComponent } from '../components/discount-detail/discount-detail.component';
import { VendorDetailComponent } from '../components/vendor-detail/vendor-detail.component';
import { StatisticsComponent } from '../components/statistics/statistics.component';
import { ModeratorDashboardComponent } from '../components/moderator-dashboard/moderator-dashboard.component';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {path: 'home/:id', component: DiscountDetailComponent},
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {path: 'statistics', component: StatisticsComponent},
  {path: 'add-new', component: ModeratorDashboardComponent},
  {path: 'user-profile', component: UserProfileComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

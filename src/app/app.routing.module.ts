import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { NotFoundComponent } from './not-found';
import { LoginFormComponent } from './login-form';
import { ModeratorDashboardComponent } from './moderator-dashboard/moderator-dashboard.component';
import { AuthGuard } from './guards';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: 'moderator-dashboard',
    component: ModeratorDashboardComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

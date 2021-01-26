import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { NotFoundComponent } from './not-found';
import { LoginFormComponent } from './login-form';
import { AuthGuard } from './guards';
import { NgModule } from '@angular/core';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
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

  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}


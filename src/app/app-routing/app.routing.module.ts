import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { NotFoundComponent } from '../shared/components/not-found.components/not-found.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {path: 'home', loadChildren: () => import('../home/home.module.js').then((m => m.HomeModule)),},
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

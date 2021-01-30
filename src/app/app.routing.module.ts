import { Routes, RouterModule } from '@angular/router';
//import { AuthGuard } from './guards';
import { NgModule } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { NotFoundComponent } from './shared/components/not-found.components/not-found.component';
import { HomeComponent } from './components/home/home.component';

const appRoutes: Routes = [
    {
        path:'',
        redirectTo: '/home',
        pathMatch:'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        // canActivate: [AuthGuard],
    },
    {
        path: 'login',
        component: LoginFormComponent
    },

    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
    })
    export class AppRoutingModule { }


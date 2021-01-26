import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { UndefinedComponent } from './undefined';
import { LoginFormComponent } from './login-form';
import { AuthGuard } from './guards';

const appRoutes: Routes = [
    {
        path: '',
        component: LoginFormComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'Undefined',
        component: UndefinedComponent
    },

 
    { path: '**', redirectTo: 'Undefined' }
];

export const routing = RouterModule.forRoot(appRoutes);


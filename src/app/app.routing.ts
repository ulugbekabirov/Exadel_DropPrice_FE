import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { UndefinedComponent } from './undefined';
import { LoginFormComponent } from './login-form';
import { AuthGuard } from './guards';
import { AuthInfo } from './models';

const appRoutes: Routes = [
    {
        path: 'admin',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { roles: [AuthInfo] }
    },
    {
        path: 'user',
        component: HomeComponent,
        canActivate: [AuthGuard],
        // data: { roles: [Role.Admin] } 
    },
    {
        path: 'moder',
        component: HomeComponent,
        canActivate: [AuthGuard],
        // data: { roles: [Role.Admin] } 
    },
    {
        path: 'Undefined',
        component: UndefinedComponent
    },

 
    { path: '**', redirectTo: 'Undefined' }
];

export const routing = RouterModule.forRoot(appRoutes);


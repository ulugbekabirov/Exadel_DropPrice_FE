import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { NotFoundComponent } from './not-found';
import { LoginFormComponent } from './login-form';
import { AuthGuard } from './guards';

const appRoutes: Routes = [
    {
        path:'',
        redirectTo: '/home',
        pathMatch:'full'
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

    { path: '**', component: NotFoundComponent }
];

export const routing = RouterModule.forRoot(appRoutes);


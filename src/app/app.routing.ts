import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
// import { AdminComponent } from './admin';
import { LoginFormComponent } from './login-form';
// import { AuthGuard } from './guards';
// import { Role } from './_models';

const appRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        // canActivate: [AuthGuard]
    },
    // {
    //     path: 'admin',
    //     component: AdminComponent,
    //     canActivate: [AuthGuard],
    //     // data: { roles: [Role.Admin] } // осуществляется роль админа
    // },
    {
        path: 'login',
        component: LoginFormComponent
    },

    // с любого другого выхода переходит в логин
    { path: '**', redirectTo: 'login' }
];

export const routing = RouterModule.forRoot(appRoutes);

// !!! замечание: в закоментированных кодах используется гард и не созданный компоненты,
// типо админа, конкретно здесь и сейчас у меня не получиться использовать их, т.к
// , нужно указать, какая роль пользователя имеет "доступ" к маршруту
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
//Router 
//ActivatedRouteSnapshot позволяет получить различную информацию из запроса,
// в том числе параметры маршрута и строки запроса
// import { AuthenticationService } from ',/services'; // подключаюсь к серверу

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        // если currentUser существует, тогда идет проверка ролец
        if (currentUser) {
            //проверка ролей
            // если определены роли и меня не нашло в этих ролях 
            // меня перекинут на главную
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
                // роль не авторизована, поэтому перенаправляет на домашнюю страницу
                this.router.navigate(['/']);
                return false;
            }

            // если у меня есть роли, либо нет ролей, и
            //в ролях нашло какое-то значение ролей, возвращается true
            return true;
        }

         
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
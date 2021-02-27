import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {path: '', component: LoginFormComponent}
];

@NgModule({
  declarations: [
    LoginFormComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports: [
    RouterModule
  ]
})
export class AuthModule {
}

import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserCardComponent } from './components/user-card/user-card.component';

const routes: Routes = [
  {path: '', component: UserProfileComponent}
];

@NgModule({
  declarations: [
    UserProfileComponent,
    UserCardComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class UserProfileModule { }

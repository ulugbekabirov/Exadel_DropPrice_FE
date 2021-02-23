import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { SavedListComponent } from './components/saved-list/saved-list.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { OrdersListItemComponent } from './components/orders-list-item/orders-list-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { SavedListItemComponent } from './components/saved-list-item/saved-list-item.component';

const routes: Routes = [
  {path: '', component: UserProfileComponent}
];

@NgModule({
  declarations: [
    UserProfileComponent,
    UserCardComponent,
    SavedListComponent,
    OrdersListComponent,
    OrdersListItemComponent,
    SavedListItemComponent,
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
export class UserProfileModule {
}

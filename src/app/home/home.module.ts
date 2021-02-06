import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'discounts', loadChildren: () => import ('../discounts/discounts.module.js')
          .then(m => m.DiscountsModule)},
      // {path: 'user-profile', loadChildren: () => import ('../user-profile/user-profile.module')
      //     .then(m => m.UserProfileModule)},
      // {path: 'moderator', loadChildren: () => import ('../moderator/moderator.module')
      //     .then(m => m.ModeratorModule)},
      // {path: 'statistics', loadChildren: () => import ('../statistics/statistics.module.js')
      //     .then(m => m.StatisticsModule)},
    ]
  }
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class HomeModule {
}

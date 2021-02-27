import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DiscountDetailComponent } from './components/discount-detail/discount-detail.component';
import { AuthGuard } from '../guards/auth.guard';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { SharedModule } from '../shared/shared.module';
import { HomeFacadeService } from './services/home-facade.service';

const routes: Routes = [
  {
    path: '',
    component: DiscountsComponent,
    canActivate: [AuthGuard]
  },
  {path: 'discounts/:id', component: DiscountDetailComponent},

];

@NgModule({
  declarations: [
    DiscountsComponent,
    DiscountDetailComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    HomeFacadeService
  ]
})
export class HomeModule { }

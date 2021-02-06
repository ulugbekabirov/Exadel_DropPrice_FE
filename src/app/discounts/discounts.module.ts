import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { DiscountDetailComponent } from './components/discount-detail/discount-detail.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountsComponent,
    // children: [
    //   { path: '', component: DiscountsHomeComponent },
    //   { path: 'new', component: DiscountEditComponent },
    //   {
    //     path: ':id',
    //     component: DiscountDetailComponent,
    //     resolve: [DiscountsResolverService]
    //   },
    //   {
    //     path: ':id/edit',
    //     component: DiscountEditComponent,
    //     resolve: [DiscountsResolverService]
    //   }
    // ]
  }
];

@NgModule({
  declarations: [
    DiscountsComponent,
    DiscountDetailComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DiscountsModule { }

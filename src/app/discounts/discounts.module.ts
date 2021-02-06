import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DiscountsListComponent } from '../shared/components/discounts-list/discounts-list.component';
import { DiscountComponent } from './components/discount/discount.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountsListComponent,
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
    DiscountComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DiscountsModule { }

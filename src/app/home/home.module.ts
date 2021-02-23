import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {path: '', component: DiscountsComponent},
];

@NgModule({
  declarations: [
    DiscountsComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class HomeModule { }

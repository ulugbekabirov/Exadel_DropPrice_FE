import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { VendorDetailComponent } from './components/vendor-detail/vendor-detail.component';
import { VendorsComponent } from './components/vendors/vendors.component';

const routes: Routes = [
  {path: '',
    component: VendorsComponent,
    children: [
      {path: ':id', component: VendorDetailComponent}
    ]
  }
];

@NgModule({
  declarations: [
    VendorDetailComponent,
    VendorsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class VendorsModule {
}

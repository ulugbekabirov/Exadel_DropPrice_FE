import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ModeratorDashboardComponent } from './components/moderator-dashboard/moderator-dashboard.component';

const routes: Routes = [
  {path: '', component: ModeratorDashboardComponent}
];

@NgModule({
  declarations: [
    ModeratorDashboardComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class ModeratorModule { }

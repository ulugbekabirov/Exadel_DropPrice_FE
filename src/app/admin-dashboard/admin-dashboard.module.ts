import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {path: '', component: AdminDashboardComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    StatisticsComponent,
    AdminDashboardComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AdminDashboardModule { }

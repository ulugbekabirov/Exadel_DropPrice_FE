import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { StatisticsComponent } from './components/statistics/statistics.component';

const routes: Routes = [
  {path: '', component: StatisticsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    StatisticsComponent
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

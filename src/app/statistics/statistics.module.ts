import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { StatisticsComponent } from './components/statistics/statistics.component';

const routes: Routes = [
  {path: '', component: StatisticsComponent}
];

@NgModule({
  declarations: [
    StatisticsComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class StatisticsModule { }

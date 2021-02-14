import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminContentComponent } from './components/admin-content/admin-content.component';
import { AdminSearchComponent } from './components/admin-search/admin-search.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchFacadeService } from './services/search-facade.service';

const routes: Routes = [
  {path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  declarations: [
    StatisticsComponent,
    AdminDashboardComponent,
    AdminSidebarComponent,
    AdminContentComponent,
    AdminSearchComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatToolbarModule,
  ],
  exports: [
    RouterModule
  ],
  providers: [
    SearchFacadeService
  ]
})
export class AdminDashboardModule { }

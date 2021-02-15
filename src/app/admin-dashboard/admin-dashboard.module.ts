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
import { SearchFacade } from './services/search-facade';
import { SettingsComponent } from './components/settings/settings.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

const routes: Routes = [
  {path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: 'stats/:name',
      //   component: AdminContentComponent
      // },
      {path: 'vendors', component: AdminContentComponent},
      {path: 'discounts', component: StatisticsComponent},
      {path: 'settings', component: SettingsComponent}
    ]
  }
];

@NgModule({
  declarations: [
    StatisticsComponent,
    AdminDashboardComponent,
    AdminSidebarComponent,
    AdminContentComponent,
    AdminSearchComponent,
    SettingsComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  exports: [
    RouterModule
  ],
  providers: [
    SearchFacade
  ]
})
export class AdminDashboardModule { }

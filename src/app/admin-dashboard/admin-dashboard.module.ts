import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AdminSearchComponent } from './components/admin-search/admin-search.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SettingsComponent } from './components/settings/settings.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SettingItemComponent } from './components/setting-item/setting-item.component';
import { DiscountsStatisticComponent } from './components/discounts-statistic/discounts-statistic.component';
import { VendorStatisticsComponent } from './components/vendor-statistics/vendor-statistics.component';
import { StatisticsFacadeService } from './services/statistics-facade.service';
import { MatFormFieldModule } from '@angular/material/form-field';

const routes: Routes = [
  {path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'vendors', component: VendorStatisticsComponent},
      {path: 'discounts', component: DiscountsStatisticComponent},
      {path: 'settings', component: SettingsComponent}
    ]
  }
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminSearchComponent,
    SettingsComponent,
    SettingItemComponent,
    DiscountsStatisticComponent,
    VendorStatisticsComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    StatisticsFacadeService
  ]
})
export class AdminDashboardModule { }

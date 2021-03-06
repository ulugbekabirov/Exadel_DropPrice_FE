import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent {
  collapseSidebar;

  onWidthChange($event: any): void {
    this.collapseSidebar = $event;
  }
}

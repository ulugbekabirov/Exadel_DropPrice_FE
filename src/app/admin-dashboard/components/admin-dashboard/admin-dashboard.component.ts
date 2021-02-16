import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  collapseSidebar;

  onWidthChange($event: any): void {
    this.collapseSidebar = $event;
  }
}

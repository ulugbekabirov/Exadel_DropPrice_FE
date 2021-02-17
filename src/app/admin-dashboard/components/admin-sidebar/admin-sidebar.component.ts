import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {
  collapsed = false;
  mobileOpened = false;

  @Output() changeCollapse = new EventEmitter();

  collapseSidebar(): void {
    this.collapsed = !this.collapsed;
    this.changeCollapse.emit(this.collapsed);
  }

  toddleMobile($event): void {
    this.mobileOpened = !this.mobileOpened;
  }
}

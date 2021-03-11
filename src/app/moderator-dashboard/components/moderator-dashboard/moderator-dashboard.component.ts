import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-moderator-dashboard',
  templateUrl: './moderator-dashboard.component.html',
  styleUrls: ['./moderator-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModeratorDashboardComponent {
  hasUnsavedChanges = false;

  changeHasUnsavedChanges(event: any): void {
    this.hasUnsavedChanges = event;
  }
}

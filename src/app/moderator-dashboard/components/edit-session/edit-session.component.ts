import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss']
})
export class EditSessionComponent {
@Input() editSession$;
@Output() onResumeEditSession: EventEmitter<any> = new EventEmitter();
  resumeEditSession($event): void {
    this.onResumeEditSession.emit($event);
  }
}

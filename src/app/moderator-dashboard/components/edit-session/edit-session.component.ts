import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss']
})
export class EditSessionComponent implements OnInit {
  @Input() editSession$;
  @Output() onResumeEditSession: EventEmitter<any> = new EventEmitter();
  editSession;
  editMessage;
  timeEditing;

  ngOnInit(): void {
    this.editSession$.pipe()
      .subscribe(session => {
        console.log(session);
        this.editSession = session;
      });
  }

  resumeEditSession($event): void {
    this.onResumeEditSession.emit($event);
  }
}

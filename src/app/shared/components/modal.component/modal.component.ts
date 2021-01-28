import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() title = '';
  @Input() content;
  @Output() confirm = new EventEmitter<void>();
  @Output() abort = new EventEmitter<void>();
}

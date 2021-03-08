import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() confirm = new EventEmitter<boolean>();

  allow(): void {
    this.confirm.emit(true);
  }

  prevent(): void {
    this.confirm.emit(false);
  }
}

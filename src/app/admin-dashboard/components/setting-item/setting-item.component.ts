import { ChangeDetectionStrategy, EventEmitter, Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component } from '@angular/core';
import { Setting } from '../../../models/setting';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-setting-item',
  templateUrl: './setting-item.component.html',
  styleUrls: ['./setting-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SettingItemComponent {
  @Input()
  setting: Setting;
  @Output()
  onSettingChange = new EventEmitter();
  @Input()
  settingEdit: FormGroup;

  changeConfig(configId: number): void {
    this.onSettingChange.emit(configId);
  }
}

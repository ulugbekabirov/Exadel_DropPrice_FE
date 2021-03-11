import { ChangeDetectionStrategy, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Component } from '@angular/core';
import { Setting } from '../../../models/setting';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-setting-item',
  templateUrl: './setting-item.component.html',
  styleUrls: ['./setting-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SettingItemComponent implements OnInit {
  @Input() setting: Setting;
  @Output() onSettingChange = new EventEmitter();
  settingControl;

  ngOnInit(): void {
    this.settingControl = new FormControl('');
    if (this.setting.dataType === 'bool') {
      this.settingControl.patchValue(this.setting.configValue === 'true');
      return;
    }
    this.settingControl.patchValue(this.setting.configValue);
  }

  changeConfig(configId: number, newValue): void {
    this.onSettingChange.emit({configId, newValue});
  }
}

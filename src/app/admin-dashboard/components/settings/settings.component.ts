import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../../../services/api-data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Setting } from '../../../models/setting';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings$: Observable<Setting[]>;
  settingEdit: FormGroup = new FormGroup({
    settingValue: new FormControl('', Validators.required)
  });

  constructor(
    private api: ApiDataService,
  ) {}

  ngOnInit(): void {
    this.settings$ = this.api.getApiConfigs();
  }

  changeSetting(configId: number): void {
    const {settingValue} = this.settingEdit.value;
    this.api.putApiConfig(configId, settingValue);
  }
}

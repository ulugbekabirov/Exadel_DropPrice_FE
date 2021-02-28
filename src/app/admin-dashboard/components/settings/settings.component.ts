import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiDataService } from '../../../services/api-data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Setting } from '../../../models/setting';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-settings',
  templateUrl: './settings-test.component.html',
  styleUrls: ['./settings-test.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  settings: Setting[];
  settingEdit: FormGroup = new FormGroup({
    settingValue: new FormControl('', Validators.required)
  });
  private unsubscribe$ = new Subject<void>();


  constructor(
    private api: ApiDataService,
  ) {
  }

  ngOnInit(): void {
    this.api.getApiConfigs()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(resp => {
        if (!resp) {
          return;
        }
        this.settings = resp;
      });
  }

  changeSetting(configId: number): void {
    const {settingValue} = this.settingEdit.value;
    this.api.putApiConfig(configId, settingValue)
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(
      resp => {
        this.settingEdit.reset();
        this.settings = this.settings.map((config: Setting) => {
          return config.configId === resp.configId
            ? {...config, configValue: resp.configValue}
            : {...config};
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

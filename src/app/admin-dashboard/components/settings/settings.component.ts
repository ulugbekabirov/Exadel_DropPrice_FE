import { Component, OnDestroy, OnInit } from '@angular/core';
import { Setting } from '../../../models/setting';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsService } from '../../services/settings/settings.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  settings: Setting[];
  private unsubscribe$ = new Subject<void>();


  constructor(
    private settingsService: SettingsService,
  ) {
  }

  ngOnInit(): void {
    this.settingsService.getApiConfigs()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(settings => {
        if (!settings) {
          return;
        }
        this.settings = settings;
      });
  }

  changeSetting({configId, newValue}): void {
    this.settingsService.putApiConfig(configId, newValue)
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(
      resp => {
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

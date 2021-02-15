import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../../../services/api-data.service';
import { FormControl } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { SettingsService } from '../../services/settings.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  configs$;
  configRadius = new FormControl();
  defaultRadiusValues$: Observable<any>;
  radiusSelected$: Observable<any>;

  constructor(
    private api: ApiDataService,
    private settingsService: SettingsService
  ) {
    this.configs$ = this.api.getApiConfigs();
    this.defaultRadiusValues$ = this.settingsService.radiusData$;
    this.radiusSelected$ = this.settingsService.radiusSelected$;
  }

  ngOnInit(): void {
    this.configRadius.valueChanges.subscribe(next => this.settingsService.setRadiusSelected(next));
    this.radiusSelected$.pipe(
      switchMap(result => {
        return this.api.putApiConfig(1, result)
      })
    ).subscribe();
  }
}

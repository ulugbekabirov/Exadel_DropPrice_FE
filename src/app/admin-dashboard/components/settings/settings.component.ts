import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiDataService } from '../../../services/api-data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Setting } from '../../../models/setting';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  settings$: Observable<Setting[]>;
  settingEdit: FormGroup = new FormGroup({
    settingValue: new FormControl('', Validators.required)
  });
  private unsubscribe$ = new Subject<void>();


  constructor(
    private api: ApiDataService,
  ) {}

  ngOnInit(): void {
    this.settings$ = this.api.getApiConfigs();
  }

  changeSetting(configId: number): void {
    const {settingValue} = this.settingEdit.value;
    this.api.putApiConfig(configId, settingValue)
      .pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

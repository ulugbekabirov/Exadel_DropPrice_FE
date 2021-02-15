import { Injectable } from '@angular/core';
import { ApiDataService } from '../../services/api-data.service';
import { BehaviorSubjectItem } from './sort-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SettingItem<T> {
  value: T;
  text: string;
}

export interface SettingsState<T> {
  data: SettingItem<T>[];
  selected: string[];
}

type RadiusState = SettingsState<string>;


const SETTINGS_INITIAL_STATE = {
  radius: {
    data: [
      '10000',
      '40000',
      '100000',
      '1000000'
    ],
    selected: '40000'
  }
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private restApi: ApiDataService
  ) {
  }

  settingsState: BehaviorSubjectItem<SettingsState> = new BehaviorSubjectItem(SETTINGS_INITIAL_STATE);

  radius$: Observable<RadiusState> = this.settingsState.value$.pipe(
    map(searchState => searchState.radius)
  );

  radiusData$: Observable<SettingItem<string>[]> = this.radius$.pipe(
    map(radius => radius.data),
  );

  radiusSelected$: Observable<string[]> = this.radius$.pipe(
    map(radius => radius.selected),
  );

  setRadiusData(data: SettingItem<string>[]): void {
    const oldState = this.settingsState.value;
    this.settingsState.value = {
      ...oldState,
      radius: {
        ...oldState.radius,
        data,
      },
    };
  }

  setRadiusSelected(selected: string[]): void {
    const oldState = this.settingsState.value;
    this.settingsState.value = {
      ...oldState,
      radius: {
        ...oldState.radius,
        selected,
      },
    };
  }

}

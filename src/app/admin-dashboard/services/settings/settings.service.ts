import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiDataService } from '../../../services/api-data/api-data.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private  restApi: ApiDataService
  ) {}

  getApiConfigs(): Observable<any> {
    return this.restApi.getApiConfigs();
  }

  putApiConfig(configId, settingValue): Observable<any> {
    return this.restApi.putApiConfig(configId, settingValue.toString());
  }

}

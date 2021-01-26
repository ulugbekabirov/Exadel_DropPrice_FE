import { Injectable } from '@angular/core';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MissingTranslationService implements MissingTranslationHandler {
  constructor() {}
  handle(params: MissingTranslationHandlerParams) {
    return `WARN: '${params.key}' is missing in '${params.translateService.currentLang}' locale`;
  }
}

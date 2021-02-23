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
  handle(params: MissingTranslationHandlerParams): string {
    return `WARN: '${params.key}' is missing in '${params.translateService.currentLang}' locale`;
  }
}

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { KEY_ACTIVE_USER } from '../../constants';
import { ActiveUser } from '../models';
import { ApiDataService } from './api-data.service';

export interface Language {
  activeLanguage: string;
  languages: string[];
}

const INITIAL_LANGUAGE_STATE = {
  activeLanguage: '',
  languages: []
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private languagesSubject: BehaviorSubject<Language>;
  public languages$: Observable<Language>;
  public availableLanguages: string[] = environment.locales;
  public defaultLang: string = environment.defaultLocale;
  protected nameInLS = 'currentLang';

  constructor() {
    this.languagesSubject = new BehaviorSubject<Language>(this.getCurrentLanguages());
    this.languages$ = this.languagesSubject.asObservable();
  }


  getCurrentLanguages(): any {
    const languages = this.availableLanguages;
    const activeLanguage = localStorage.getItem(this.nameInLS) ?? this.defaultLang;
    return {
      languages,
      activeLanguage
    };
  }

  setLanguageTolS(selectedLang: string): void {
    localStorage.setItem(this.nameInLS, selectedLang);
  }

  removeLanguageFromLS(): void {
    localStorage.removeItem(this.nameInLS);
  }

  select<T>(name: string): Observable<T> {
    return this.languages$.pipe(pluck(name));
  }

  set(name: string, state: any): void {
    this.languagesSubject.next({
      ...this.languagesValue, [name]: state
    });
    if (name === 'activeLanguage') {
      this.setLanguageTolS(state);
    }
  }

  get languagesValue(): Language {
    return this.languagesSubject.value;
  }
}

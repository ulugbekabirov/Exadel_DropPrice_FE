import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TownsService } from '../towns/towns.service';


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
  public language$: Observable<Language>;
  public availableLanguages: string[] = environment.locales;
  public defaultLang: string = environment.defaultLocale;
  protected nameInLS = 'currentLang';

  constructor() {
    this.languagesSubject = new BehaviorSubject<Language>(this.getCurrentLanguages());
    this.language$ = this.languagesSubject.asObservable();
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
    return this.language$.pipe(pluck(name));
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

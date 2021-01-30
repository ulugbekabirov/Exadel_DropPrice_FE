import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public langs: string[] = environment.locales;
  public defaultLang: string = environment.defaultLocale;

  protected nameInLS: string = 'currentLang';

  getCurrentLang() {
    return localStorage.getItem(this.nameInLS) ?? this.defaultLang;
  }

  setLanguageTolS(selectedLang: string) {
    localStorage.setItem(this.nameInLS, selectedLang);
  }

  removeLanguageFromLS() {
    localStorage.removeItem(this.nameInLS);
  }
}
